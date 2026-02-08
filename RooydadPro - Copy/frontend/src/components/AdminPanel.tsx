import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CalendarDays, Users, Settings, LogOut, 
  DollarSign, Ticket as TicketIcon, Plus, Search, Trash2, Edit,
  GraduationCap, CheckCircle2, Loader2, MapPin, Clock, Image as ImageIcon,
  X, Eye, ArrowRight, UserCheck, XCircle
} from 'lucide-react';
import type { Event, User, Instructor, Ticket } from '../types';
import { Button } from './Button';
import { adminService } from '../services/adminService';
import { eventService } from '../services/eventService';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </button>
);

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'instructors' | 'users' | 'settings'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // داده‌ها
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [transactions, setTransactions] = useState<Ticket[]>([]);

  // استیت‌های مودال و انتخاب
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // برای نمایش جزئیات و حضور غیاب
  
  // فرم دیتاها
  const [eventFormData, setEventFormData] = useState<any>({ is_virtual: false });
  const [instructorFormData, setInstructorFormData] = useState<any>({});

  // لود اطلاعات
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await eventService.getAllEvents().catch(() => []);
        const usersData = await adminService.getAllUsers().catch(() => []);
        const instructorsData = await adminService.getAllInstructors().catch(() => []);
        const transactionsData = await adminService.getAllTransactions().catch(() => []);

        setEvents(eventsData);
        setUsers(usersData);
        setInstructors(instructorsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Critical error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- هندلرهای رویداد ---
  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('آیا مطمئن هستید؟ عملیات غیرقابل بازگشت است.')) {
        await adminService.deleteEvent(id);
        setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    if (eventFormData.date_input && eventFormData.time_input) {
        const now = new Date();
        formData.append('start_datetime', now.toISOString()); 
        formData.append('date_display', eventFormData.date_input);
        formData.append('time_display', eventFormData.time_input);
    }

    Object.keys(eventFormData).forEach(key => {
        if (key !== 'date_input' && key !== 'time_input' && eventFormData[key] !== null) {
             formData.append(key, eventFormData[key]);
        }
    });

    try {
        await adminService.createEvent(formData);
        alert('رویداد با موفقیت ایجاد شد');
        setIsEventModalOpen(false);
        setEventFormData({ is_virtual: false });
        const data = await eventService.getAllEvents();
        setEvents(data);
    } catch (error) {
        alert('خطا در ذخیره رویداد');
    }
  };

  // --- هندلرهای استاد ---
  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(instructorFormData).forEach(key => {
        if (instructorFormData[key] !== null) formData.append(key, instructorFormData[key]);
    });

    try {
        await adminService.createInstructor(formData);
        alert('استاد اضافه شد');
        setIsInstructorModalOpen(false);
        setInstructorFormData({});
        const data = await adminService.getAllInstructors();
        setInstructors(data);
    } catch (error) {
        alert('خطا در ذخیره استاد');
    }
  };

  const handleDeleteInstructor = async (id: number) => {
      if(window.confirm("حذف استاد؟")) {
          await adminService.deleteInstructor(id);
          setInstructors(prev => prev.filter(i => i.id !== id));
      }
  }

  // --- هندلر حضور و غیاب ---
  const handleToggleAttendance = async (ticketId: number, currentStatus: boolean) => {
      // آپدیت سریع در UI (Optimistic UI)
      setTransactions(prev => prev.map(t => 
          t.id === ticketId ? { ...t, is_present: !currentStatus } : t
      ));

      try {
          await adminService.toggleTicketAttendance(ticketId, !currentStatus);
      } catch (error) {
          alert("خطا در ثبت حضور و غیاب");
          // برگرداندن به حالت قبل در صورت خطا
          setTransactions(prev => prev.map(t => 
            t.id === ticketId ? { ...t, is_present: currentStatus } : t
        ));
      }
  };

  // محاسبات
  const totalRevenue = events.reduce((acc, curr) => acc + (curr.price * curr.registered_count), 0);
  const totalTickets = events.reduce((acc, curr) => acc + curr.registered_count, 0);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      
      {/* سایدبار */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 right-0 z-50 shadow-2xl">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
          <span className="text-lg font-bold text-white">پنل مدیریت</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="داشبورد" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<CalendarDays size={20} />} label="رویدادها" isActive={activeTab === 'events'} onClick={() => { setActiveTab('events'); setSelectedEvent(null); }} />
          <SidebarItem icon={<GraduationCap size={20} />} label="اساتید" isActive={activeTab === 'instructors'} onClick={() => setActiveTab('instructors')} />
          <SidebarItem icon={<Users size={20} />} label="کاربران" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarItem icon={<Settings size={20} />} label="تنظیمات" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut size={20} />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 mr-64 p-8 transition-all duration-300">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black text-slate-900">
                {activeTab === 'dashboard' && 'خلاصه وضعیت'}
                {activeTab === 'events' && (selectedEvent ? 'جزئیات و حضور غیاب' : 'مدیریت رویدادها')}
                {activeTab === 'instructors' && 'مدیریت اساتید'}
                {activeTab === 'users' && 'لیست کاربران'}
                {activeTab === 'settings' && 'تنظیمات سیستم'}
            </h1>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-600">{currentUser?.username}</span>
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold">A</div>
            </div>
        </header>

        {/* === داشبورد === */}
        {activeTab === 'dashboard' && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex justify-between mb-4"><span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign /></span></div>
                        <h3 className="text-slate-500 text-sm font-medium">درآمد کل</h3>
                        <p className="text-2xl font-black text-slate-800">{totalRevenue.toLocaleString()} تومان</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex justify-between mb-4"><span className="p-3 bg-primary-50 text-primary-600 rounded-2xl"><TicketIcon /></span></div>
                        <h3 className="text-slate-500 text-sm font-medium">بلیت فروخته شده</h3>
                        <p className="text-2xl font-black text-slate-800">{totalTickets}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex justify-between mb-4"><span className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><CalendarDays /></span></div>
                        <h3 className="text-slate-500 text-sm font-medium">رویداد فعال</h3>
                        <p className="text-2xl font-black text-slate-800">{events.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex justify-between mb-4"><span className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Users /></span></div>
                        <h3 className="text-slate-500 text-sm font-medium">کاربر عضو</h3>
                        <p className="text-2xl font-black text-slate-800">{users.length}</p>
                    </div>
                </div>

                {/* جدول تراکنش‌ها */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">تراکنش‌های اخیر</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50 text-xs text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">کاربر</th>
                                    <th className="px-6 py-4">رویداد</th>
                                    <th className="px-6 py-4">مبلغ</th>
                                    <th className="px-6 py-4">تاریخ</th>
                                    <th className="px-6 py-4">وضعیت</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {!transactions || transactions.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">تراکنشی یافت نشد.</td></tr>
                                ) : (
                                    transactions.slice(0, 5).map((tx) => {
                                        const user = users.find(u => u.id === tx.user);
                                        return (
                                            <tr key={tx.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 text-sm font-medium">{user ? user.username : 'کاربر ناشناس'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{tx.event_details?.title || '-'}</td>
                                                <td className="px-6 py-4 font-bold">{Number(tx.price_paid).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-xs font-mono">{new Date(tx.purchase_date).toLocaleDateString('fa-IR')}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100'}`}>
                                                        {tx.status === 'paid' ? 'موفق' : 'ناموفق'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* === رویدادها (لیست یا جزئیات) === */}
        {activeTab === 'events' && (
            <>
                {/* حالت نمایش جزئیات و حضور غیاب */}
                {selectedEvent ? (
                    <div className="space-y-8 animate-in slide-in-from-right-10 fade-in duration-300">
                        <Button variant="ghost" onClick={() => setSelectedEvent(null)} className="gap-2 text-slate-500 hover:text-slate-800 mb-2">
                            <ArrowRight size={18} /> بازگشت به لیست
                        </Button>

                        {/* کارت اطلاعات رویداد */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                            <div className="w-full md:w-1/3 h-64 md:h-auto relative">
                                <img src={selectedEvent.image || ''} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <div className="text-white">
                                        <h2 className="text-2xl font-black mb-1">{selectedEvent.title}</h2>
                                        <p className="text-sm opacity-90">{selectedEvent.category_details?.title}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><Users size={20} /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold">مدرس</p>
                                            <p className="font-bold text-slate-800">{selectedEvent.instructor_details?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={20} /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold">قیمت</p>
                                            <p className="font-bold text-slate-800">{selectedEvent.price.toLocaleString()} تومان</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><CalendarDays size={20} /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold">زمان برگزاری</p>
                                            <p className="font-bold text-slate-800">{selectedEvent.date_display} | {selectedEvent.time_display}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={20} /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold">مکان / نوع</p>
                                            <p className="font-bold text-slate-800">{selectedEvent.is_virtual ? 'مجازی' : selectedEvent.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* لیست شرکت‌کنندگان و حضور غیاب */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <UserCheck className="text-primary-600" /> لیست شرکت‌کنندگان و حضور غیاب
                                </h3>
                                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border">
                                    تعداد ثبت نام: {selectedEvent.registered_count} نفر
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium">
                                        <tr>
                                            <th className="px-6 py-4">شرکت کننده</th>
                                            <th className="px-6 py-4">شماره بلیت</th>
                                            <th className="px-6 py-4">موبایل</th>
                                            <th className="px-6 py-4 text-center">وضعیت حضور</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {transactions.filter(t => t.event === selectedEvent.id && t.status === 'paid').length === 0 ? (
                                            <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">هنوز کسی در این رویداد ثبت‌نام نکرده است.</td></tr>
                                        ) : (
                                            transactions
                                                .filter(t => t.event === selectedEvent.id && t.status === 'paid')
                                                .map(ticket => {
                                                    const user = users.find(u => u.id === ticket.user);
                                                    return (
                                                        <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                                        {user?.first_name ? user.first_name[0] : 'U'}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-slate-800">{user ? `${user.first_name} ${user.last_name}` : 'کاربر ناشناس'}</span>
                                                                        <span className="text-xs text-slate-400">{user?.username}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 font-mono text-sm">{ticket.ticket_code}</td>
                                                            <td className="px-6 py-4 font-mono text-sm text-slate-500">{user?.phone || '-'}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <label className="inline-flex items-center cursor-pointer">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        className="sr-only peer"
                                                                        checked={ticket.is_present}
                                                                        onChange={() => handleToggleAttendance(ticket.id, ticket.is_present)}
                                                                    />
                                                                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                                    <span className="ms-3 text-sm font-medium text-slate-700 w-16 text-right">
                                                                        {ticket.is_present ? 'حاضر' : 'غایب'}
                                                                    </span>
                                                                </label>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    // حالت لیست رویدادها
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                            <div className="relative w-64">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" placeholder="جستجوی رویداد..." className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-primary-500 transition-all" />
                            </div>
                            <Button onClick={() => setIsEventModalOpen(true)} className="gap-2 shadow-lg shadow-primary-500/30">
                                <Plus size={18} /> ایجاد رویداد جدید
                            </Button>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-right">
                                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">تصویر</th>
                                        <th className="px-6 py-4">عنوان رویداد</th>
                                        <th className="px-6 py-4">مدرس</th>
                                        <th className="px-6 py-4">زمان برگزاری</th>
                                        <th className="px-6 py-4">مبلغ / ظرفیت</th>
                                        <th className="px-6 py-4">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {events.map(event => (
                                        <tr key={event.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-100">
                                                    <img src={event.image || ''} className="w-full h-full object-cover" alt="Event" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-800">{event.title}</p>
                                                <p className="text-xs text-slate-500 mt-1">{event.category_details?.title || 'دسته‌بندی نشده'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">{event.instructor_details?.name || 'نامشخص'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-slate-700 block">{event.date_display}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${event.is_virtual ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {event.is_virtual ? 'مجازی' : 'حضوری'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-xs gap-1">
                                                    <span className="font-bold text-emerald-600">{Number(event.price).toLocaleString()}</span>
                                                    <span className="text-slate-500">{event.registered_count} / {event.capacity} نفر</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {/* دکمه مشاهده و حضور غیاب */}
                                                    <button 
                                                        onClick={() => setSelectedEvent(event)}
                                                        className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                        title="مدیریت و حضور غیاب"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"><Edit size={18} /></button>
                                                    <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </>
        )}

        {/* === اساتید === */}
        {activeTab === 'instructors' && (
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Button onClick={() => setIsInstructorModalOpen(true)} className="gap-2"><Plus size={18} /> افزودن استاد</Button>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">تصویر</th>
                                <th className="px-6 py-4">نام</th>
                                <th className="px-6 py-4">تخصص</th>
                                <th className="px-6 py-4">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {instructors.map(inst => (
                                <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4"><img src={inst.image || ''} className="w-10 h-10 rounded-full object-cover" /></td>
                                    <td className="px-6 py-4 font-bold">{inst.name}</td>
                                    <td className="px-6 py-4 text-sm">{inst.expertise}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleDeleteInstructor(inst.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* === کاربران === */}
        {activeTab === 'users' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">نام کاربری</th>
                            <th className="px-6 py-4">موبایل</th>
                            <th className="px-6 py-4">نقش</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="px-6 py-4 font-bold">{u.username}</td>
                                <td className="px-6 py-4 text-sm font-mono">{u.phone}</td>
                                <td className="px-6 py-4">{u.is_organizer ? 'ادمین' : 'کاربر'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* === تنظیمات === */}
        {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold mb-6 text-slate-800">تنظیمات ظاهری پنل</h2>
                    <p className="text-slate-500 text-sm mb-8">رنگ سازمانی و تنظیمات عمومی پنل خود را تغییر دهید.</p>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">رنگ تم اصلی</label>
                            <div className="flex gap-4">
                                {['indigo', 'emerald', 'rose', 'amber', 'blue'].map(color => (
                                    <button 
                                        key={color}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110 ring-2 ring-offset-2 ${
                                            color === 'indigo' ? 'bg-indigo-600 ring-indigo-600' :
                                            color === 'emerald' ? 'bg-emerald-600 ring-transparent' :
                                            color === 'rose' ? 'bg-rose-600 ring-transparent' :
                                            color === 'amber' ? 'bg-amber-500 ring-transparent' :
                                            'bg-blue-600 ring-transparent'
                                        }`}
                                    >
                                        {color === 'indigo' && <CheckCircle2 className="text-white" size={20} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-100">
                             <Button disabled className="w-full">ذخیره تنظیمات (به زودی)</Button>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </main>

      {/* مودال افزودن استاد */}
      {isInstructorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsInstructorModalOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
                <h2 className="text-xl font-bold mb-6 text-slate-800">افزودن استاد جدید</h2>
                <form onSubmit={handleSaveInstructor} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">نام و نام خانوادگی</label>
                        <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500" onChange={e => setInstructorFormData({...instructorFormData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">تخصص</label>
                        <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500" onChange={e => setInstructorFormData({...instructorFormData, expertise: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">بیوگرافی کوتاه</label>
                        <textarea required rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500" onChange={e => setInstructorFormData({...instructorFormData, bio: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">تصویر پروفایل</label>
                        <input type="file" accept="image/*" className="w-full p-2 border border-slate-200 rounded-xl text-sm" onChange={e => setInstructorFormData({...instructorFormData, image: e.target.files?.[0]})} />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsInstructorModalOpen(false)}>انصراف</Button>
                        <Button type="submit" className="flex-1">ذخیره اطلاعات</Button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* مودال ایجاد رویداد */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEventModalOpen(false)}></div>
             <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                
                {/* هدر مودال */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Plus className="text-primary-600" /> ایجاد رویداد جدید
                    </h2>
                    <button onClick={() => setIsEventModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* فرم اصلی */}
                <form onSubmit={handleSaveEvent} className="overflow-y-auto p-8 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* ستون راست: اطلاعات پایه */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-4 border-b pb-2">اطلاعات عمومی</h3>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان رویداد</label>
                                <input required placeholder="مثلاً: کارگاه آموزش ریکت پیشرفته" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all" onChange={e => setEventFormData({...eventFormData, title: e.target.value})} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">دسته‌بندی</label>
                                    <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500" onChange={e => setEventFormData({...eventFormData, category: e.target.value})}>
                                        <option value="">انتخاب کنید...</option>
                                        <option value="1">تکنولوژی و برنامه نویسی</option>
                                        <option value="2">هنر و طراحی</option>
                                        <option value="3">کسب و کار</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">مدرس دوره</label>
                                    <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500" onChange={e => setEventFormData({...eventFormData, instructor: e.target.value})}>
                                        <option value="">انتخاب کنید...</option>
                                        {instructors.map(inst => (
                                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">توضیحات کامل</label>
                                <textarea rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500" placeholder="توضیحاتی در مورد سرفصل‌ها و مزایای شرکت در این رویداد..." onChange={e => setEventFormData({...eventFormData, description: e.target.value})}></textarea>
                            </div>
                        </div>

                        {/* ستون چپ: جزئیات برگزاری */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-4 border-b pb-2">زمان و مکان</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">تاریخ برگزاری</label>
                                    <input type="text" placeholder="۱۴۰۳/۰۲/۲۰" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500 text-center font-mono" onChange={e => setEventFormData({...eventFormData, date_input: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">ساعت شروع</label>
                                    <input type="text" placeholder="۱۸:۰۰" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500 text-center font-mono" onChange={e => setEventFormData({...eventFormData, time_input: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">قیمت (تومان)</label>
                                    <div className="relative">
                                        <input type="number" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500 font-bold text-emerald-600" onChange={e => setEventFormData({...eventFormData, price: e.target.value})} />
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">ظرفیت کل</label>
                                    <div className="relative">
                                        <input type="number" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary-500" onChange={e => setEventFormData({...eventFormData, capacity: e.target.value})} />
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" checked={eventFormData.is_virtual} onChange={e => setEventFormData({...eventFormData, is_virtual: e.target.checked})} />
                                    <span className="font-bold text-slate-700">این رویداد به صورت مجازی برگزار می‌شود</span>
                                </label>
                                
                                {eventFormData.is_virtual ? (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">لینک جلسه آنلاین</label>
                                        <input type="url" placeholder="https://meet.google.com/..." className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-left dir-ltr" onChange={e => setEventFormData({...eventFormData, meeting_link: e.target.value})} />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">آدرس محل برگزاری</label>
                                        <input type="text" placeholder="تهران، خیابان آزادی..." className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" onChange={e => setEventFormData({...eventFormData, location: e.target.value})} />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">تصویر بنر رویداد</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <input type="file" accept="image/*" className="hidden" id="event-image-upload" onChange={e => setEventFormData({...eventFormData, image: e.target.files?.[0]})} />
                                    <label htmlFor="event-image-upload" className="cursor-pointer flex flex-col items-center">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary-500 group-hover:bg-primary-50 transition-colors mb-2">
                                            <ImageIcon size={24} />
                                        </div>
                                        <span className="text-sm text-slate-500 group-hover:text-slate-700">برای آپلود تصویر کلیک کنید</span>
                                        <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* فوتر مودال */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setIsEventModalOpen(false)}>انصراف</Button>
                    <Button onClick={handleSaveEvent} className="px-8 shadow-lg shadow-primary-500/20">ثبت و انتشار رویداد</Button>
                </div>
             </div>
        </div>
      )}

    </div>
  );
};