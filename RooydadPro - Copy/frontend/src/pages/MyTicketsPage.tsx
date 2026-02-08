import React, { useEffect, useState } from 'react';
import { ticketService } from '../services/ticketService';
import { Header } from '../components/Header';
import { Loader2, Ticket as TicketIcon, Calendar, MapPin, QrCode, Download } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

// تعریف تایپ بلیت برای این صفحه (یا ایمپورت از types)
interface TicketData {
    id: number;
    ticket_code: string;
    status: string;
    price_paid: string;
    event_details: {
        title: string;
        date_display: string;
        time_display: string;
        location: string;
        image: string;
        is_virtual: boolean;
    };
}

export const MyTicketsPage: React.FC = () => {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        const fetchTickets = async () => {
            try {
                const data = await ticketService.getMyTickets();
                setTickets(data);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Header onLoginClick={() => {}} />

            <div className="container mx-auto px-4 pt-32">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl">
                        <TicketIcon size={24} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800">بلیت‌های من</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 text-lg mb-4">شما هنوز هیچ بلیتی خریداری نکرده‌اید.</p>
                        <Button onClick={() => navigate('/')} variant="outline">مشاهده رویدادها</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative group hover:shadow-lg transition-shadow">
                                {/* نوار رنگی وضعیت */}
                                <div className={`h-2 w-full ${ticket.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{ticket.event_details.title}</h3>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-mono">
                                            {ticket.ticket_code}
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-sm text-slate-500 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-primary-500" />
                                            <span>{ticket.event_details.date_display} | {ticket.event_details.time_display}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-primary-500" />
                                            <span>{ticket.event_details.is_virtual ? 'رویداد آنلاین' : ticket.event_details.location}</span>
                                        </div>
                                    </div>

                                    {/* خط جداکننده پانچ شده */}
                                    <div className="relative w-full h-px bg-slate-100 my-6">
                                        <div className="absolute -left-8 -top-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-200"></div>
                                        <div className="absolute -right-8 -top-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-200"></div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400">وضعیت پرداخت</span>
                                            <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                موفق
                                            </span>
                                        </div>
                                        <QrCode size={48} className="text-slate-800 opacity-80" />
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 border-t border-slate-100">
                                    <Button variant="outline" className="w-full gap-2 text-xs h-10">
                                        <Download size={16} />
                                        دانلود نسخه PDF
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};