import axios from 'axios';

// آدرس بک‌اند
const API_URL = 'http://127.0.0.1:8000/api/';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// اینترسپتور درخواست: اضافه کردن توکن
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// اینترسپتور پاسخ: مدیریت خطاها
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // اگر خطای شبکه بود (قطع اینترنت یا خاموشی سرور)
    if (error.code === "ERR_NETWORK") {
        alert("خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید یا مطمئن شوید سرور جنگو روشن است.");
    }
    
    // اگر توکن منقضی شده بود (خطای 401)
    if (error.response && error.response.status === 401) {
        // اگر کاربر در حال تلاش برای لاگین نیست ولی خطای 401 می‌گیرد
        if (!window.location.pathname.includes('/admin')) {
             // می‌توانیم اینجا کاربر را لاگ‌اوت کنیم (اختیاری)
             // localStorage.removeItem('access_token');
        }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;