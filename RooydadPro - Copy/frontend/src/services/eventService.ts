import apiClient from './apiClient';
import { Event } from '../types';

export const eventService = {
    getAllEvents: async () => {
        const response = await apiClient.get<Event[]>('events/events/');
        return response.data;
    },
    
    getEventById: async (id: number) => {
        const response = await apiClient.get<Event>(`events/events/${id}/`);
        return response.data;
    }
};