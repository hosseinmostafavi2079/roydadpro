import React, { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import { Event } from '../types';
import { Loader2 } from 'lucide-react';
// فعلا EventCard را ساده ایمپورت میکنیم، بعدا کاملش میکنیم
// import { EventCard } from '../components/EventCard'; 

export const HomePage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventService.getAllEvents();
                setEvents(data);
            } catch (error) {
                console.error("Error loading events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={48} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">رویدادهای جدید (داده واقعی از دیتابیس)</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event.id} className="bg-white p-4 rounded-xl shadow border">
                        <img src={event.image || 'https://via.placeholder.com/400'} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-4"/>
                        <h3 className="font-bold text-lg">{event.title}</h3>
                        <p className="text-sm text-slate-500 mt-2">{event.date_display} | {event.time_display}</p>
                        <p className="text-primary-600 font-bold mt-2">{event.price.toLocaleString()} تومان</p>
                    </div>
                ))}
            </div>
        </div>
    );
};