import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from './Button';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // دریافت وضعیت لاگین از استیت منیجر
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* لوگو */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-white font-bold text-xl">
              R
            </div>
            <span className={`text-2xl font-black tracking-tight ${isScrolled ? 'text-slate-800' : 'text-slate-900'}`}>
              رویداد<span className="text-primary-600">پرو</span>
            </span>
          </Link>

          {/* منوی دسکتاپ */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">خانه</Link>
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">رویدادها</Link>
            {isAuthenticated && (
                <Link to="/my-tickets" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">بلیت‌های من</Link>
            )}
          </nav>

          {/* دکمه‌های سمت چپ */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                 <span className="text-sm font-bold text-slate-700">
                    {user?.first_name} {user?.last_name}
                 </span>
                 <div className="h-6 w-px bg-slate-200"></div>
                 <Button onClick={logout} variant="ghost" className="gap-2 text-slate-600 text-sm hover:text-rose-500">
                    <LogOut size={18} />
                    <span>خروج</span>
                 </Button>
                 <div className="w-10 h-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    {user?.username.charAt(0).toUpperCase()}
                 </div>
              </div>
            ) : (
              <Button onClick={onLoginClick} variant="primary" className="gap-2">
                <User size={18} />
                <span>ورود / ثبت نام</span>
              </Button>
            )}
          </div>

          {/* منوی موبایل */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* دراپ‌داون موبایل */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg p-4 flex flex-col gap-4">
          <Link to="/" className="block w-full text-right p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium">خانه</Link>
          <div className="border-t border-slate-100 pt-4">
            {isAuthenticated ? (
                <Button onClick={logout} className="w-full justify-center bg-slate-100 text-slate-700">خروج</Button>
            ) : (
                <Button onClick={onLoginClick} className="w-full justify-center">ورود / ثبت نام</Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};