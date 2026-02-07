import apiClient from './apiClient';

export const authService = {
    login: async (username: string, password: string) => {
        // 1. دریافت توکن
        const response = await apiClient.post('token/', { username, password });
        const { access, refresh } = response.data;
        
        localStorage.setItem('refresh_token', refresh);
        
        // 2. دریافت اطلاعات کاربر (چون توکن فقط کد رمزنگاری شده است)
        // نکته: ما نیاز داریم یک اندپوینت برای گرفتن پروفایل کاربر داشته باشیم
        // فعلا فقط توکن را برمی‌گردانیم، در ادامه هندل می‌کنیم
        return { access, refresh };
    },
    
    getUserProfile: async () => {
        // فعلا لیست یوزرها رو فیلتر میکنیم (در آینده اندپوینت /me میسازیم)
        // این یک روش موقت برای فاز توسعه است
        const response = await apiClient.get('core/users/');
        return response.data[0]; // فرض میکنیم اولی خودمان هستیم (نیاز به اصلاح در بکند دارد)
    }
};