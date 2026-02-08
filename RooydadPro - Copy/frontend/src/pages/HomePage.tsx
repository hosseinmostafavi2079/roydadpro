import React, { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import type { Event } from '../types';
import { Loader2, Search } from 'lucide-react';
import { Header } from '../components/Header';
import { EventCard } from '../components/EventCard';
import { AuthModal } from '../components/AuthModal';

export const HomePage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

    // فیلتر کردن رویدادها بر اساس متن جستجو
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* هدر سایت */}
            <Header onLoginClick={() => setIsAuthModalOpen(true)} />

            {/* بخش هیرو (Hero) */}
            <section className="pt-32 pb-16 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                    کشف رویدادهای <span className="text-primary-600">خاص و بی‌نظیر</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    بهترین کنسرت‌ها، کارگاه‌ها و همایش‌ها را در اینجا پیدا کنید.
                </p>
            </section>

            {/* لیست رویدادها و جستجو */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-black text-slate-800">جدیدترین رویدادها</h2>
                    
                    {/* نوار جستجو */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="جستجو در رویدادها..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pr-12 pl-4 rounded-xl border border-slate-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all shadow-sm"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={20} />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex py-20 items-center justify-center">
                        <Loader2 className="animate-spin text-primary-600" size={48} />
                    </div>
                ) : filteredEvents.length === 0 ? (
                     <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-500 text-lg">
                            {searchTerm ? 'هیچ رویدادی با این مشخصات یافت نشد.' : 'هنوز رویدادی ثبت نشده است.'}
                        </p>
                        {!searchTerm && <p className="text-sm text-slate-400 mt-2">از پنل ادمین جنگو چند رویداد اضافه کنید.</p>}
                     </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>

            {/* مودال لاگین */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};