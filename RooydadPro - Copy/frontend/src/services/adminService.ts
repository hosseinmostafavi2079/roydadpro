import apiClient from './apiClient';
import type { User, Event, Instructor, Ticket } from '../types';

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

    // === مدیریت رویدادها ===
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

    // === مدیریت تراکنش‌ها (این بخش حیاتی است) ===
    getAllTransactions: async () => {
        try {
            const response = await apiClient.get<Ticket[]>('finance/tickets/');
            return response.data;
        } catch (error) {
            console.error("Error loading transactions", error);
            return []; // بازگرداندن آرایه خالی در صورت خطا تا صفحه سفید نشود
        }
    },

    // تابع جدید برای حضور و غیاب
    toggleTicketAttendance: async (ticketId: number, isPresent: boolean) => {
        const response = await apiClient.patch(`finance/tickets/${ticketId}/`, {
            is_present: isPresent
        });
        return response.data;
    },
    
    updateOrganizationSettings: async (orgId: number, data: any) => {
        const response = await apiClient.patch(`core/organizations/${orgId}/`, data);
        return response.data;
    }
};