import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import type { Event } from '../types';
import { Loader2, ArrowRight, Calendar, MapPin, Clock, Video, User } from 'lucide-react';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { BookingModal } from '../components/BookingModal';
import { AuthModal } from '../components/AuthModal';
import { useAuthStore } from '../store/authStore';

export const EventDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const data = await eventService.getEventById(Number(id));
                setEvent(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBookClick = () => {
        if (isAuthenticated) {
            setIsBookingOpen(true);
        } else {
            setIsAuthOpen(true);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
    if (!event) return <div className="h-screen flex items-center justify-center">رویداد یافت نشد</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Header onLoginClick={() => setIsAuthOpen(true)} />
            
            {/* هدر تصویر */}
            <div className="relative h-[400px] w-full mt-16">
                <img src={event.image || ''} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="absolute top-4 right-4 container mx-auto">
                    <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:bg-white/20 gap-2">
                        <ArrowRight /> بازگشت
                    </Button>
                </div>
                <div className="absolute bottom-0 w-full p-8 container mx-auto">
                    <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-bold mb-4 inline-block">
                        {event.category_details?.title}
                    </span>
                    <h1 className="text-4xl font-black text-white mb-4">{event.title}</h1>
                    <div className="flex gap-6 text-slate-200 text-sm font-medium">
                        <div className="flex gap-2"><Calendar size={18} /> {event.date_display}</div>
                        <div className="flex gap-2"><Clock size={18} /> {event.time_display}</div>
                        <div className="flex gap-2"><MapPin size={18} /> {event.is_virtual ? 'آنلاین' : event.location}</div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ستون راست: توضیحات */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4 text-slate-800">درباره رویداد</h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{event.description}</p>
                    </div>

                    {event.instructor_details && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm flex gap-6">
                            <img src={event.instructor_details.image || ''} className="w-24 h-24 rounded-full object-cover" />
                            <div>
                                <h3 className="text-xl font-bold mb-1">{event.instructor_details.name}</h3>
                                <p className="text-primary-600 text-sm mb-3">{event.instructor_details.expertise}</p>
                                <p className="text-slate-500 text-sm">{event.instructor_details.bio}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ستون چپ: باکس خرید */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-500">قیمت بلیت</span>
                            <div className="text-2xl font-black text-slate-800">
                                {event.price.toLocaleString()} <span className="text-sm text-slate-400">تومان</span>
                            </div>
                        </div>
                        
                        <Button onClick={handleBookClick} size="lg" className="w-full shadow-primary-500/20 py-4 text-lg">
                            {event.is_virtual ? 'ثبت‌نام و دریافت لینک' : 'خرید بلیت و رزرو'}
                        </Button>

                        {event.is_virtual && (
                            <div className="mt-4 p-4 bg-indigo-50 rounded-2xl flex gap-3 border border-indigo-100">
                                <Video className="text-indigo-500 shrink-0" />
                                <p className="text-xs text-indigo-700 leading-relaxed">
                                    لینک جلسه پس از خرید فعال می‌شود.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} event={event} />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
    );
};