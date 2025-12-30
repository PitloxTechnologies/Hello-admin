'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Bell,
    Check,
    CheckCheck,
    Trash2,
    MessageSquare,
    Home,
    AlertCircle,
    X,
    MoreVertical
} from 'lucide-react';
import { notificationsApi } from '../api/notifications';
import { Notification, NotificationType } from '../api/types';

const typeIcons: Record<NotificationType, typeof Bell> = {
    [NotificationType.MESSAGE]: MessageSquare,
    [NotificationType.ROOM_INQUIRY]: Home,
    [NotificationType.ROOM_UPDATE]: Home,
    [NotificationType.SYSTEM]: AlertCircle,
};

const typeColors: Record<NotificationType, string> = {
    [NotificationType.MESSAGE]: 'bg-[var(--primary-500)]/20 text-[var(--primary-400)] border border-[var(--primary-500)]/20',
    [NotificationType.ROOM_INQUIRY]: 'bg-[var(--accent-500)]/20 text-[var(--accent-400)] border border-[var(--accent-500)]/20',
    [NotificationType.ROOM_UPDATE]: 'bg-[var(--success-500)]/20 text-[var(--success-400)] border border-[var(--success-500)]/20',
    [NotificationType.SYSTEM]: 'bg-[var(--warning-500)]/20 text-[var(--warning-400)] border border-[var(--warning-500)]/20',
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('');
    const [filterRead, setFilterRead] = useState<string>('');

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationsApi.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationsApi.markAsRead(id);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async (receiverId: string) => {
        try {
            await notificationsApi.markAllAsRead(receiverId);
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDeleteNotification = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notification?')) return;

        try {
            await notificationsApi.removeNotification(id);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!notif.title?.toLowerCase().includes(query) &&
                !notif.body?.toLowerCase().includes(query)) {
                return false;
            }
        }
        if (filterType && notif.data?.type !== filterType) return false;
        if (filterRead === 'read' && !notif.read) return false;
        if (filterRead === 'unread' && notif.read) return false;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const formatTimeAgo = (date?: Date) => {
        if (!date) return 'Unknown';
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    return (
        <div className="max-w-4xl mx-auto pt-12 lg:pt-0">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">
                        {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={() => {
                            const firstReceiverId = notifications.find(n => !n.read)?.receiverId;
                            if (firstReceiverId) handleMarkAllAsRead(firstReceiverId);
                        }}
                        className="btn btn-primary"
                    >
                        <CheckCheck size={18} />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="card mb-8 p-4 bg-[var(--bg-secondary)]/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="input w-auto"
                        >
                            <option value="">All Types</option>
                            <option value="message">Messages</option>
                            <option value="room_inquiry">Room Inquiries</option>
                            <option value="room_update">Room Updates</option>
                            <option value="system">System</option>
                        </select>
                        <select
                            value={filterRead}
                            onChange={(e) => setFilterRead(e.target.value)}
                            className="input w-auto"
                        >
                            <option value="">All</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--primary-400)] mb-1">{notifications.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Total</p>
                </div>
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--error-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--error-400)] mb-1">{unreadCount}</p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Unread</p>
                </div>
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--success-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--success-400)] mb-1">
                        {notifications.filter(n => n.read).length}
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Read</p>
                </div>
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--warning-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--warning-400)] mb-1">{filteredNotifications.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Filtered</p>
                </div>
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="loading-spinner" />
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Bell size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">No notifications</h3>
                        <p className="text-[var(--text-secondary)]">
                            {searchQuery || filterType || filterRead
                                ? 'Try adjusting your filters'
                                : "You're all caught up!"}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredNotifications.map((notification) => {
                        const Icon = typeIcons[notification.data?.type] || Bell;
                        const colorClass = typeColors[notification.data?.type] || 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]';

                        return (
                            <div
                                key={notification.id}
                                className={`card flex items-start gap-5 p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${!notification.read
                                    ? 'border-l-4 border-l-[var(--primary-500)] bg-[var(--primary-500)]/5 relative overflow-hidden'
                                    : 'hover:bg-[var(--bg-tertiary)]/20'
                                    }`}
                            >
                                {/* Unread indicator glow */}
                                {!notification.read && (
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary-500)]/10 blur-[50px] rounded-full pointer-events-none -mr-10 -mt-10" />
                                )}

                                <div className={`p-3 rounded-xl shadow-inner ${colorClass} flex-shrink-0`}>
                                    <Icon size={24} />
                                </div>

                                <div className="flex-1 min-w-0 z-10">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className={`font-semibold text-lg leading-tight ${!notification.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                                            }`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs font-medium text-[var(--text-tertiary)] whitespace-nowrap bg-[var(--bg-tertiary)]/50 px-2 py-1 rounded-lg">
                                            {formatTimeAgo(notification.createdAt)}
                                        </span>
                                    </div>

                                    <p className="text-[var(--text-secondary)] mb-3 leading-relaxed">
                                        {notification.body}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <span className={`badge ${notification.data?.type === NotificationType.MESSAGE ? 'badge-info' :
                                            notification.data?.type === NotificationType.ROOM_INQUIRY ? 'badge-purple' :
                                                notification.data?.type === NotificationType.ROOM_UPDATE ? 'badge-success' :
                                                    'badge-warning'
                                            }`}>
                                            {notification.data?.type?.replace('_', ' ') || 'notification'}
                                        </span>
                                        {!notification.read && (
                                            <span className="badge badge-error animate-pulse">Unread</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 z-10 self-center">
                                    {!notification.read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--success-400)] transition-colors"
                                            title="Mark as read"
                                        >
                                            <Check size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteNotification(notification.id)}
                                        className="p-2 rounded-lg hover:bg-[var(--error-400)]/10 text-[var(--text-tertiary)] hover:text-[var(--error-400)] transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
