import { api } from '../config/api';
import { Notification } from './types';

export interface NotificationFilters {
    receiverId?: string;
    read?: boolean;
    type?: string;
    limit?: number;
}

export const notificationsApi = {
    /**
     * Get all notifications with optional filtering
     */
    getNotifications: (filters?: NotificationFilters) =>
        api<Notification[]>('/notifications', { params: filters as Record<string, string | number | boolean | undefined> }),

    /**
     * Get all notifications for a user
     */
    getUserNotifications: (receiverId: string, unreadOnly?: boolean) =>
        api<Notification[]>(`/notifications/user/${receiverId}`, { params: { unreadOnly } as Record<string, string | number | boolean | undefined> }),

    /**
     * Get unread notification count for a user
     */
    getUnreadCount: (receiverId: string) =>
        api<{ count: number }>(`/notifications/user/${receiverId}/unread-count`),

    /**
     * Get a single notification by ID
     */
    getNotification: (id: string) =>
        api<Notification>(`/notifications/${id}`),

    /**
     * Create a new notification
     */
    createNotification: (data: Omit<Notification, 'id' | 'read' | 'createdAt'>) =>
        api<Notification>('/notifications', { method: 'POST', body: data as unknown }),

    /**
     * Update a notification by ID
     */
    updateNotification: (id: string, data: Partial<Notification>) =>
        api<Notification>(`/notifications/${id}`, { method: 'PATCH', body: data as unknown }),

    /**
     * Mark a notification as read
     */
    markAsRead: (id: string) =>
        api<Notification>(`/notifications/${id}/read`, { method: 'PATCH' }),

    /**
     * Mark all notifications as read for a user
     */
    markAllAsRead: (receiverId: string) =>
        api<{ message: string; count: number }>(`/notifications/user/${receiverId}/read-all`, { method: 'PATCH' }),

    /**
     * Delete a notification by ID
     */
    removeNotification: (id: string) =>
        api<{ message: string }>(`/notifications/${id}`, { method: 'DELETE' }),
};
