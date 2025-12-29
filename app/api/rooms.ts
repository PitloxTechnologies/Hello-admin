import { api } from '../config/api';
import { Room } from './types';

export interface RoomFilters {
    city?: string;
    userId?: string;
    userType?: string;
    minRent?: number;
    maxRent?: number;
    limit?: number;
}

export const roomsApi = {
    /**
     * Get all rooms with optional filtering
     */
    getRooms: (filters?: RoomFilters) =>
        api<Room[]>('/rooms', { params: filters as Record<string, string | number | boolean | undefined> }),

    /**
     * Get a single room by ID
     */
    getRoom: (id: string) =>
        api<Room>(`/rooms/${id}`),

    /**
     * Create a new room listing
     */
    createRoom: (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) =>
        api<Room>('/rooms', { method: 'POST', body: data }),

    /**
     * Update a room listing
     */
    updateRoom: (id: string, data: Partial<Room>) =>
        api<Room>(`/rooms/${id}`, { method: 'PATCH', body: data }),

    /**
     * Delete a room listing
     */
    deleteRoom: (id: string) =>
        api<{ message: string }>(`/rooms/${id}`, { method: 'DELETE' }),

    /**
     * Get all rooms by user ID
     */
    getRoomsByUserId: (userId: string) =>
        api<Room[]>(`/rooms/user/${userId}`),

    /**
     * Search rooms by city
     */
    searchByCity: (city: string) =>
        api<Room[]>(`/rooms/search/city/${city}`),
};
