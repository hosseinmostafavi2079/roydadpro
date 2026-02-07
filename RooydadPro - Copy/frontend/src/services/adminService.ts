import apiClient from './apiClient';
import type { User, Event, Instructor } from '../types';

export const adminService = {
    // === مدیریت کاربران ===
    getAllUsers: async () => {
        const response = await apiClient.get<User[]>('core/users/');
        return response.data;
    },
    
    // === مدیریت اساتید ===
    getAllInstructors: async () => {
        const response = await apiClient.get<Instructor[]>('events/instructors/');
        return response.data;
    },
    
    createInstructor: async (data: FormData) => {
        const response = await apiClient.post('events/instructors/', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteInstructor: async (id: number) => {
        await apiClient.delete(`events/instructors/${id}/`);
    },

    // === مدیریت رویدادها (عملیات ادمین) ===
    createEvent: async (data: FormData) => {
        const response = await apiClient.post('events/events/', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    
    updateEvent: async (id: number, data: FormData) => {
        const response = await apiClient.put(`events/events/${id}/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteEvent: async (id: number) => {
        await apiClient.delete(`events/events/${id}/`);
    },

    updateOrganizationSettings: async (orgId: number, data: any) => {
        const response = await apiClient.patch(`core/organizations/${orgId}/`, data);
        return response.data;
    }
    // === آمار داشبورد (فعلا محاسبه در فرانت) ===
    // در پروژه‌های بزرگ این باید یک API جداگانه باشد
};