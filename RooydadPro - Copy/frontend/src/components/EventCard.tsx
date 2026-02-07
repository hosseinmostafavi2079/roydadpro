import React from 'react';
import { Calendar, MapPin, Users, ArrowLeft, Heart } from 'lucide-react';
import type { Event } from '../types';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // محاسبه درصد تکمیل ظرفیت
  const capacityPercent = Math.round((event.registered_count / event.capacity) * 100);
  const spotsLeft = event.capacity - event.registered_count;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full relative">
      
      {/* دکمه لایک (ظاهری) */}
      <button className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white transition-all duration-300 group/heart">
        <Heart size={20} className="text-white group-hover/heart:text-rose-500 transition-colors" />
      </button>

      {/* بخش تصویر */}
      <div className="relative h-48 sm:h-56 overflow-hidden cursor-pointer">
        <img 
          src={event.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        
        {/* بج دسته‌بندی */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-primary-700 shadow-sm">
            {event.category_details?.title || 'عمومی'}
          </span>
        </div>

        {/* برچسب قیمت هوشمند */}
        <div className="absolute bottom-4 left-4">
          <div className={`px-3 py-1.5 rounded-xl shadow-lg font-bold text-sm flex items-center gap-1 ${
              event.price === 0 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : 'bg-primary-600 text-white shadow-primary-900/20'
          }`}>
            {event.price === 0 ? (
                <span>رایگان!</span>
            ) : (
                <>
                    <span>{event.price.toLocaleString('fa-IR')}</span>
                    <span className="text-xs opacity-90">تومان</span>
                </>
            )}
          </div>
        </div>
      </div>

      {/* محتوای کارت */}
      <div className="p-6 flex-1 flex flex-col">
        {/* تاریخ و مکان */}
        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-3">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
            <Calendar size={14} className="text-primary-500" />
            <span>{event.date_display}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
            <MapPin size={14} className="text-primary-500" />
            <span>{event.is_virtual ? 'آنلاین (مجازی)' : event.location}</span>
          </div>
        </div>

        {/* عنوان */}
        <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-2 leading-relaxed group-hover:text-primary-600 transition-colors cursor-pointer">
          {event.title}
        </h3>

        {/* نوار ظرفیت (پایین کارت) */}
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Users size={14} />
              <span>ظرفیت تکمیل شده</span>
            </div>
            <span className={`text-xs font-bold ${spotsLeft < 10 ? 'text-rose-500' : 'text-primary-600'}`}>
              {spotsLeft < 10 ? `فقط ${spotsLeft} صندلی مانده!` : `${capacityPercent}%`}
            </span>
          </div>
          
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${spotsLeft < 10 ? 'bg-gradient-to-l from-rose-500 to-orange-500' : 'bg-gradient-to-l from-primary-500 to-purple-500'}`}
              style={{ width: `${capacityPercent}%` }}
            ></div>
          </div>

          <div className="mt-6">
            <Link to={`/events/${event.id}`}>
                <Button 
                variant="outline" 
                className="w-full justify-between group/btn hover:bg-primary-50 hover:border-primary-200"
                >
                <span>مشاهده و رزرو</span>
                <ArrowLeft size={18} className="transition-transform group-hover/btn:-translate-x-1" />
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};