import axios from 'axios';

// آدرس پایه بک‌اند (اگر پورت جنگو فرق دارد اینجا تغییر دهید)
const API_URL = 'http://127.0.0.1:8000/api/';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// این قطعه کد توکن را به هدر اضافه می‌کند
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;