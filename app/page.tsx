'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Home,
    Package,
    Bell,
    TrendingUp,
    UserCheck,
    Building2,
    ShoppingBag,
    ArrowUpRight,
    Clock
} from 'lucide-react';
import { StatsCard } from './components';
import { usersApi } from './api/users';
import { roomsApi } from './api/rooms';
import { usedItemsApi } from './api/used-items';
import { notificationsApi } from './api/notifications';
import { User, Room, UsedItem, Notification } from './api/types';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalRooms: 0,
        totalItems: 0,
        unreadNotifications: 0,
    });
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [recentRooms, setRecentRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch data in parallel
            const [users, rooms, items] = await Promise.all([
                usersApi.getUsers({ limit: 100 }).catch(() => []),
                roomsApi.getRooms({ limit: 100 }).catch(() => []),
                usedItemsApi.getUsedItems({ limit: 100 }).catch(() => []),
            ]);

            setStats({
                totalUsers: users.length,
                activeUsers: users.filter(u => u.isActive).length,
                totalRooms: rooms.length,
                totalItems: items.length,
                unreadNotifications: 0,
            });

            setRecentUsers(users.slice(0, 5));
            setRecentRooms(rooms.slice(0, 4));
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (date?: Date) => {
        if (!date) return 'Unknown';
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="max-w-7xl mx-auto pt-12 lg:pt-0">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Welcome back! Here&apos;s what&apos;s happening with Hello Roomie.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid mb-8">
                <StatsCard
                    title="Total Users"
                    value={loading ? '...' : stats.totalUsers}
                    subtitle="All registered users"
                    icon={Users}
                    color="cyan"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Active Users"
                    value={loading ? '...' : stats.activeUsers}
                    subtitle="Currently active"
                    icon={UserCheck}
                    color="green"
                    trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                    title="Room Listings"
                    value={loading ? '...' : stats.totalRooms}
                    subtitle="Available rooms"
                    icon={Building2}
                    color="purple"
                    trend={{ value: 5, isPositive: true }}
                />
                <StatsCard
                    title="Used Items"
                    value={loading ? '...' : stats.totalItems}
                    subtitle="Marketplace items"
                    icon={ShoppingBag}
                    color="orange"
                    trend={{ value: 3, isPositive: false }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Users */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Users</h2>
                                <p className="text-sm text-[var(--text-tertiary)]">Latest user registrations</p>
                            </div>
                            <a
                                href="/users"
                                className="flex items-center gap-1 text-sm text-[var(--primary-400)] hover:text-[var(--primary-300)] font-medium"
                            >
                                View all <ArrowUpRight size={16} />
                            </a>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-48">
                                <div className="loading-spinner" />
                            </div>
                        ) : recentUsers.length === 0 ? (
                            <div className="empty-state py-12">
                                <div className="empty-state-icon">
                                    <Users size={32} />
                                </div>
                                <p className="text-[var(--text-secondary)]">No users yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentUsers.map((user) => (
                                    <div
                                        key={user.uid}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                                    >
                                        <div className="avatar">
                                            {user.fullName?.charAt(0) || user.displayName?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[var(--text-primary)] truncate">
                                                {user.fullName || user.displayName || 'Unknown'}
                                            </p>
                                            <p className="text-sm text-[var(--text-tertiary)] truncate">
                                                {user.city || 'No city'} • {user.phoneNumber}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`badge ${user.profileCompleted ? 'badge-success' : 'badge-warning'}`}>
                                                {user.profileCompleted ? 'Complete' : 'Incomplete'}
                                            </span>
                                            <div className={`status-indicator ${user.isActive ? 'online' : 'offline'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Rooms */}
                <div className="lg:col-span-1">
                    <div className="card h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Rooms</h2>
                                <p className="text-sm text-[var(--text-tertiary)]">Latest listings</p>
                            </div>
                            <a
                                href="/rooms"
                                className="flex items-center gap-1 text-sm text-[var(--primary-400)] hover:text-[var(--primary-300)] font-medium"
                            >
                                View all <ArrowUpRight size={16} />
                            </a>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-48">
                                <div className="loading-spinner" />
                            </div>
                        ) : recentRooms.length === 0 ? (
                            <div className="empty-state py-12">
                                <div className="empty-state-icon">
                                    <Home size={32} />
                                </div>
                                <p className="text-[var(--text-secondary)]">No rooms yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentRooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="badge badge-info">{room.userType}</span>
                                            <span className="text-lg font-bold text-[var(--primary-400)]">
                                                ₹{room.rentPerHead?.toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="font-medium text-[var(--text-primary)] mb-1">{room.city}</p>
                                        <p className="text-sm text-[var(--text-tertiary)] line-clamp-2">
                                            {room.sizeOfPlace} • Near {room.nearbyLandmark}
                                        </p>
                                        <div className="flex items-center gap-1 mt-2 text-xs text-[var(--text-tertiary)]">
                                            <Clock size={12} />
                                            {formatTimeAgo(room.createdAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="card-glass p-4 text-center">
                    <div className="text-2xl font-bold text-[var(--primary-400)] mb-1">
                        {loading ? '...' : `${Math.round((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100)}%`}
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">User Retention</p>
                </div>
                <div className="card-glass p-4 text-center">
                    <div className="text-2xl font-bold text-[var(--accent-400)] mb-1">
                        {loading ? '...' : recentRooms.length}
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">New Rooms Today</p>
                </div>
                <div className="card-glass p-4 text-center">
                    <div className="text-2xl font-bold text-[var(--success-400)] mb-1">
                        {loading ? '...' : stats.totalItems}
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">Items Listed</p>
                </div>
                <div className="card-glass p-4 text-center">
                    <div className="text-2xl font-bold text-[var(--warning-400)] mb-1">
                        {loading ? '...' : stats.unreadNotifications}
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">Pending Notifications</p>
                </div>
            </div>
        </div>
    );
}
