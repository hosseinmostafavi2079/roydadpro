import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CalendarDays, Users, Settings, LogOut, 
  DollarSign, Ticket, Plus, Search, Edit, Trash2, Eye,
  GraduationCap, Video, CheckCircle2, XCircle, Loader2
} from 'lucide-react';
import type { Event, User, Instructor } from '../types';
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

  // داده‌های واقعی
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  // استیت‌های مودال
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  
  // فرم دیتا
  const [eventFormData, setEventFormData] = useState<any>({});
  const [instructorFormData, setInstructorFormData] = useState<any>({});

  // لود اولیه اطلاعات
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, usersData, instructorsData] = await Promise.all([
            eventService.getAllEvents(),
            adminService.getAllUsers(),
            adminService.getAllInstructors()
        ]);
        setEvents(eventsData);
        setUsers(usersData);
        setInstructors(instructorsData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // هندلر خروج
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- هندلرهای رویداد ---
  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('آیا مطمئن هستید؟ این عملیات غیرقابل بازگشت است.')) {
        await adminService.deleteEvent(id);
        setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    // تبدیل آبجکت به FormData برای ارسال فایل
    Object.keys(eventFormData).forEach(key => {
        if (eventFormData[key] !== null) formData.append(key, eventFormData[key]);
    });

    try {
        await adminService.createEvent(formData);
        alert('رویداد با موفقیت ایجاد شد');
        setIsEventModalOpen(false);
        // رفرش لیست
        const data = await eventService.getAllEvents();
        setEvents(data);
    } catch (error) {
        alert('خطا در ذخیره رویداد');
        console.error(error);
    }
  };
  
  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(instructorFormData).forEach(key => {
        if (instructorFormData[key] !== null) formData.append(key, instructorFormData[key]);
    });

    try {
        await adminService.createInstructor(formData);
        alert('استاد با موفقیت اضافه شد');
        setIsInstructorModalOpen(false);
        // رفرش لیست اساتید
        const data = await adminService.getAllInstructors();
        setInstructors(data);
    } catch (error) {
        alert('خطا در ذخیره اطلاعات استاد');
        console.error(error);
    }
  };

  const handleDeleteInstructor = async (id: number) => {
      if(window.confirm("آیا از حذف این استاد مطمئن هستید؟")) {
          await adminService.deleteInstructor(id);
          setInstructors(prev => prev.filter(i => i.id !== id));
      }
  }

  // --- محاسبات داشبورد ---
  const totalRevenue = events.reduce((acc, curr) => acc + (curr.price * curr.registered_count), 0);
  const totalTickets = events.reduce((acc, curr) => acc + curr.registered_count, 0);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

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
          <SidebarItem icon={<CalendarDays size={20} />} label="رویدادها" isActive={activeTab === 'events'} onClick={() => setActiveTab('events')} />
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
                {activeTab === 'events' && 'مدیریت رویدادها'}
                {activeTab === 'instructors' && 'مدیریت اساتید'}
                {activeTab === 'users' && 'لیست کاربران'}
            </h1>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-600">{currentUser?.username}</span>
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold">A</div>
            </div>
        </header>

        {/* === داشبورد === */}
        {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex justify-between mb-4"><span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign /></span></div>
                    <h3 className="text-slate-500 text-sm font-medium">درآمد کل</h3>
                    <p className="text-2xl font-black text-slate-800">{totalRevenue.toLocaleString()} تومان</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex justify-between mb-4"><span className="p-3 bg-primary-50 text-primary-600 rounded-2xl"><Ticket /></span></div>
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
        )}

        {/* === رویدادها === */}
        {activeTab === 'events' && (
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Button onClick={() => setIsEventModalOpen(true)} className="gap-2"><Plus size={18} /> ایجاد رویداد جدید</Button>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">عنوان</th>
                                <th className="px-6 py-4">تاریخ</th>
                                <th className="px-6 py-4">وضعیت</th>
                                <th className="px-6 py-4">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {events.map(event => (
                                <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800">{event.title}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{event.date_display}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${event.is_virtual ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {event.is_virtual ? 'مجازی' : 'حضوری'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
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
                                <td className="px-6 py-4">
                                    {u.is_organizer ? <span className="text-purple-600 font-bold text-xs">ادمین</span> : <span className="text-slate-500 text-xs">کاربر</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* === مدیریت اساتید === */}
        {activeTab === 'instructors' && (
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Button onClick={() => setIsInstructorModalOpen(true)} className="gap-2"><Plus size={18} /> افزودن استاد جدید</Button>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">تصویر</th>
                                <th className="px-6 py-4">نام و نام خانوادگی</th>
                                <th className="px-6 py-4">تخصص</th>
                                <th className="px-6 py-4">تعداد دوره</th>
                                <th className="px-6 py-4">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {instructors.map(inst => (
                                <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <img src={inst.image || ''} className="w-10 h-10 rounded-full object-cover" />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{inst.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{inst.expertise}</td>
                                    <td className="px-6 py-4 text-sm font-mono">{inst.courses_count}</td>
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
                                        onClick={() => {/* اینجا باید به سرور وصل شود - فعلا نمایشی */}}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110 ring-2 ring-offset-2 ${
                                            color === 'indigo' ? 'bg-indigo-600 ring-indigo-600' :
                                            color === 'emerald' ? 'bg-emerald-600 ring-transparent' :
                                            color === 'rose' ? 'bg-rose-600 ring-transparent' :
                                            color === 'amber' ? 'bg-amber-500 ring-transparent' :
                                            'bg-blue-600 ring-transparent'
                                        }`}
                                    >
                                        {/* تیک برای رنگ انتخاب شده */}
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

      {/* مودال ایجاد رویداد (ساده شده برای تست) */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEventModalOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl">
                <h2 className="text-xl font-bold mb-4">ایجاد رویداد جدید</h2>
                <form onSubmit={handleSaveEvent} className="space-y-4">
                    <input 
                        placeholder="عنوان رویداد" 
                        className="w-full p-3 border rounded-xl"
                        onChange={e => setEventFormData({...eventFormData, title: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                         <input placeholder="قیمت" type="number" className="w-full p-3 border rounded-xl" onChange={e => setEventFormData({...eventFormData, price: e.target.value})} />
                         <input placeholder="ظرفیت" type="number" className="w-full p-3 border rounded-xl" onChange={e => setEventFormData({...eventFormData, capacity: e.target.value})} />
                    </div>
                    {/* فیلدهای تاریخ و ... باید اینجا اضافه شوند */}
                    <p className="text-xs text-rose-500">توجه: این فرم برای تست خلاصه شده است.</p>
                    <Button type="submit" className="w-full">ذخیره</Button>
                </form>
            </div>
        </div>
      )}

      {/* مودال افزودن استاد */}
      {isInstructorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsInstructorModalOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
                <h2 className="text-xl font-bold mb-6 text-slate-800">افزودن استاد جدید</h2>
                <form onSubmit={handleSaveInstructor} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">نام و نام خانوادگی</label>
                        <input 
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all"
                            onChange={e => setInstructorFormData({...instructorFormData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">تخصص</label>
                        <input 
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all"
                            onChange={e => setInstructorFormData({...instructorFormData, expertise: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">بیوگرافی کوتاه</label>
                        <textarea 
                            required
                            rows={3}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all"
                            onChange={e => setInstructorFormData({...instructorFormData, bio: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">تصویر پروفایل</label>
                        <input 
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            onChange={e => setInstructorFormData({...instructorFormData, image: e.target.files?.[0]})}
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsInstructorModalOpen(false)}>انصراف</Button>
                        <Button type="submit" className="flex-1">ذخیره اطلاعات</Button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};