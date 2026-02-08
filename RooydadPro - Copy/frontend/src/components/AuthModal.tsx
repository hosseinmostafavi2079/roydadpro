import React, { useState } from 'react';
import { X, Smartphone, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setAuth } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. دریافت توکن
      const { access } = await authService.login(username, password);
      
      // 2. ساختن یک یوزر مصنوعی (چون هنوز اندپوینت پروفایل نداریم)
      // در فاز بعدی این را از سرور می‌گیریم
      const mockUser = {
          id: 1,
          username: username,
          first_name: 'کاربر',
          last_name: 'گرامی',
          phone: '',
          is_organizer: false,
          organization: null
      };

      setAuth(mockUser, access);
      onClose();
    } catch (err) {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transform transition-all animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 rotate-3">
             <Smartphone size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">ورود به حساب کاربری</h2>
          <p className="text-slate-500 text-sm">لطفاً نام کاربری و رمز عبور خود را وارد کنید.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           {error && <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl text-center">{error}</div>}
           
           <div>
             <input 
               type="text" 
               placeholder="نام کاربری" 
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all"
               required
             />
           </div>
           
           <div>
             <input 
               type="password" 
               placeholder="رمز عبور" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all"
               required
             />
           </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'ورود به سیستم'}
          </Button>
        </form>
      </div>
    </div>
  );
};