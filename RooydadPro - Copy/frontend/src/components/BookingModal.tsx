import React, { useState } from 'react';
import { X, Calendar, MapPin, Check, Ticket, CreditCard, Loader2 } from 'lucide-react';
import type { Event } from '../types';
import { Button } from './Button';
import { ticketService } from '../services/ticketService';
import { useAuthStore } from '../store/authStore';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  if (!isOpen || !event) return null;

  const handleConfirm = async () => {
    if (!isAuthenticated) {
        alert("لطفا ابتدا وارد حساب کاربری شوید.");
        return;
    }

    setIsLoading(true);
    try {
        // اتصال به بک‌اند واقعی برای خرید
        await ticketService.buyTicket(event.id, event.price);
        setIsSuccess(true);
    } catch (error) {
        console.error(error);
        alert("خطا در خرید بلیت. لطفا دوباره تلاش کنید.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleCloseInternal = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseInternal}></div>

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {!isSuccess && (
            <div className="h-32 bg-slate-100 relative">
                <img src={event.image || ''} alt={event.title} className="w-full h-full object-cover opacity-90" />
                <button onClick={handleCloseInternal} className="absolute top-4 left-4 p-2 bg-white/80 rounded-full">
                    <X size={20} />
                </button>
            </div>
        )}

        <div className="p-6 sm:p-8">
            {isSuccess ? (
                <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <Check size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">خرید با موفقیت انجام شد!</h2>
                    <p className="text-slate-500 mb-8">بلیت شما صادر شد و در بخش "بلیت‌های من" قابل مشاهده است.</p>
                     <Button onClick={handleCloseInternal} variant="primary" className="w-full">بازگشت</Button>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{event.title}</h2>
                    <div className="flex flex-col gap-2 text-sm text-slate-500 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary-500" />
                            <span>{event.date_display} | {event.time_display}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-primary-500" />
                            <span>{event.location}</span>
                        </div>
                    </div>

                    <div className="border-t border-b border-slate-100 py-4 mb-6 flex justify-between items-center">
                        <span className="text-slate-500">مبلغ قابل پرداخت</span>
                        <div className="text-2xl font-black text-slate-800">
                            {event.price.toLocaleString()} <span className="text-sm text-slate-400">تومان</span>
                        </div>
                    </div>

                    <Button onClick={handleConfirm} disabled={isLoading} variant="primary" size="lg" className="w-full gap-2 h-14">
                        {isLoading ? <Loader2 className="animate-spin" /> : (
                            <>
                                <CreditCard size={20} />
                                <span>پرداخت آنلاین</span>
                            </>
                        )}
                    </Button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};