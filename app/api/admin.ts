import { api } from '../config/api';
import { Admin, AdminLoginResponse } from './types';

export const adminApi = {
    /**
     * Create a new admin
     */
    createAdmin: (data: Pick<Admin, 'name' | 'email' | 'password'>) =>
        api<Admin>('/admin', { method: 'POST', body: data }),

    /**
     * Login admin
     */
    login: (data: Pick<Admin, 'email' | 'password'>) =>
        api<AdminLoginResponse>('/admin/login', { method: 'POST', body: data }),

    /**
     * Logout admin
     */
    logout: () =>
        api<{ message: string }>('/admin/logout', { method: 'POST' }),

    /**
     * Get current logged-in admin profile
     */
    getProfile: () =>
        api<Admin>('/admin/me'),

    /**
     * Get all admins
     */
    getAdmins: () =>
        api<Admin[]>('/admin'),

    /**
     * Get admin by ID
     */
    getAdmin: (id: string) =>
        api<Admin>(`/admin/${id}`),

    /**
     * Update admin by ID
     */
    updateAdmin: (id: string, data: Partial<Pick<Admin, 'name' | 'email' | 'password'>>) =>
        api<Admin>(`/admin/${id}`, { method: 'PATCH', body: data }),

    /**
     * Delete admin by ID
     */
    deleteAdmin: (id: string) =>
        api<{ message: string }>(`/admin/${id}`, { method: 'DELETE' }),
};
