import { api } from '../config/api';
import { User, Gender } from './types';

export interface UserFilters {
    city?: string;
    gender?: Gender;
    roomStatus?: string;
    isActive?: boolean;
    profileCompleted?: boolean;
    limit?: number;
}

export const usersApi = {
    /**
     * Get all users with optional filtering
     */
    getUsers: (filters?: UserFilters) =>
        api<User[]>('/users', { params: filters as Record<string, string | number | boolean | undefined> }),

    /**
     * Get potential roommates (active users with completed profiles)
     */
    getPotentialRoommates: (filters?: { city?: string; gender?: string; limit?: number }) =>
        api<User[]>('/users/roommates', { params: filters as Record<string, string | number | boolean | undefined> }),

    /**
     * Get user by UID
     */
    getUser: (uid: string) =>
        api<User>(`/users/${uid}`),

    /**
     * Get user by phone number
     */
    getUserByPhoneNumber: (phoneNumber: string) =>
        api<User | null>(`/users/phone/${phoneNumber}`),

    /**
     * Create a new user profile
     */
    createUser: (data: Omit<User, 'createdAt' | 'updatedAt' | 'lastLogin'>) =>
        api<User>('/users', { method: 'POST', body: data }),

    /**
     * Update a user profile
     */
    updateUser: (uid: string, data: Partial<User>) =>
        api<User>(`/users/${uid}`, { method: 'PATCH', body: data }),

    /**
     * Update FCM token for push notifications
     */
    updateFcmToken: (uid: string, fcmToken: string) =>
        api<{ message: string }>(`/users/${uid}/fcm-token`, { method: 'PATCH', body: { fcmToken } }),

    /**
     * Update last login timestamp
     */
    updateLastLogin: (uid: string) =>
        api<{ message: string }>(`/users/${uid}/last-login`, { method: 'PATCH' }),

    /**
     * Delete a user profile
     */
    removeUser: (uid: string) =>
        api<{ message: string }>(`/users/${uid}`, { method: 'DELETE' }),

    /**
     * Search users by city
     */
    searchByCity: (city: string) =>
        api<User[]>(`/users/search/city/${city}`),
};
