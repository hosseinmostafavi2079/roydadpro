import apiClient from './apiClient';

export const ticketService = {
    // ارسال درخواست خرید بلیت به سرور
    buyTicket: async (eventId: number, pricePaid: number) => {
        const response = await apiClient.post('finance/tickets/', {
            event: eventId,
            price_paid: pricePaid,
            status: 'paid' // در سناریوی واقعی، بعد از بازگشت از بانک این را ست می‌کنیم
        });
        return response.data;
    },

    // گرفتن لیست بلیت‌های کاربر
    getMyTickets: async () => {
        const response = await apiClient.get('finance/tickets/');
        return response.data;
    }
};