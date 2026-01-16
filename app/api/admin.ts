import { api } from '../config/api';
import { Admin, AdminLoginResponse, Report, SupportTicket, ReportStatus, SupportTicketStatus, Notify, CreateNotifyDto, UpdateNotifyDto } from './types';

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

    // --- Reports API ---

    /**
     * Get all reports
     */
    getReports: () =>
        api<Report[]>('/reports'),

    /**
     * Get report by ID
     */
    getReport: (id: string) =>
        api<Report>(`/reports/${id}`),

    /**
     * Update report
     */
    updateReport: (id: string, data: Partial<Pick<Report, 'status' | 'adminNotes'>>) =>
        api<Report>(`/reports/${id}`, { method: 'PATCH', body: data }),

    /**
     * Delete report
     */
    deleteReport: (id: string) =>
        api<{ message: string }>(`/reports/${id}`, { method: 'DELETE' }),

    // --- Support API ---

    /**
     * Get all support tickets
     */
    getSupportTickets: () =>
        api<SupportTicket[]>('/support'),

    /**
     * Get support ticket by ID
     */
    getSupportTicket: (id: string) =>
        api<SupportTicket>(`/support/${id}`),

    /**
     * Update support ticket
     */
    updateSupportTicket: (id: string, data: Partial<Pick<SupportTicket, 'status' | 'adminResponse'>>) =>
        api<SupportTicket>(`/support/${id}`, { method: 'PATCH', body: data }),

    /**
     * Delete support ticket
     */
    deleteSupportTicket: (id: string) =>
        api<{ message: string }>(`/support/${id}`, { method: 'DELETE' }),

    // --- Notify API ---

    /**
     * Get all notifications
     */
    getNotifications: () =>
        api<Notify[]>('/notify'),

    /**
     * Get notification by ID
     */
    getNotification: (id: string) =>
        api<Notify>(`/notify/${id}`),

    /**
     * Create a new notification
     */
    createNotification: (data: CreateNotifyDto) =>
        api<Notify>('/notify', { method: 'POST', body: data }),

    /**
     * Update notification by ID
     */
    updateNotification: (id: string, data: UpdateNotifyDto) =>
        api<Notify>(`/notify/${id}`, { method: 'PATCH', body: data }),

    /**
     * Delete notification by ID
     */
    deleteNotification: (id: string) =>
        api<{ message: string }>(`/notify/${id}`, { method: 'DELETE' }),
};
