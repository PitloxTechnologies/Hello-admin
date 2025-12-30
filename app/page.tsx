'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    Clock,
    Activity,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { usersApi } from './api/users';
import { roomsApi } from './api/rooms';
import { usedItemsApi } from './api/used-items';
import { User, Room } from './api/types';
import { cn } from './lib/utils';

// Bento Grid Item Component
function BentoCard({
    className,
    children,
    delay = 0
}: {
    className?: string;
    children: React.ReactNode;
    delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={cn(
                "bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl p-6 relative overflow-hidden group hover:border-[var(--border-accent)] transition-colors",
                className
            )}
        >
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
                {children}
            </div>
        </motion.div>
    );
}

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
            console.error('Failed to load data:', error);
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

        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(diff / 86400000)}d`;
    };

    // Calculate dynamic trends
    const usersTrend = stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(0) : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">Overview of your platform's performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-[var(--success-400)]">System Operational</span>
                </div>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">

                {/* Main Stats - Large Card */}
                <BentoCard className="md:col-span-2 lg:col-span-2 row-span-2 !p-8 bg-gradient-to-br from-[var(--primary-900)]/50 to-[var(--bg-secondary)] border-[var(--primary-500)]/20">
                    <div className="flex justify-between items-start mb-auto">
                        <div className="p-3 rounded-2xl bg-[var(--primary-500)]/20 text-[var(--primary-400)]">
                            <Activity size={32} />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[var(--primary-500)]/10 text-[var(--primary-400)] text-sm font-medium border border-[var(--primary-500)]/20">
                            +12% vs last week
                        </span>
                    </div>
                    <div>
                        <h3 className="text-[var(--text-secondary)] font-medium text-lg">Total Active Users</h3>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-5xl font-bold text-white tracking-tight">
                                {loading ? '...' : stats.activeUsers}
                            </span>
                            <span className="text-[var(--text-tertiary)]">/ {stats.totalUsers} registered</span>
                        </div>
                    </div>
                </BentoCard>

                {/* Rooms Card */}
                <BentoCard delay={0.1} className="hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                            <Building2 size={24} />
                        </div>
                        <TrendingUp size={20} className="text-purple-400" />
                    </div>
                    <div className="mt-auto">
                        <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                            {loading ? '...' : stats.totalRooms}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">Active Listings</p>
                    </div>
                </BentoCard>

                {/* Marketplace Card */}
                <BentoCard delay={0.2} className="hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
                            <ShoppingBag size={24} />
                        </div>
                        <ArrowUpRight size={20} className="text-orange-400" />
                    </div>
                    <div className="mt-auto">
                        <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                            {loading ? '...' : stats.totalItems}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">Marketplace Items</p>
                    </div>
                </BentoCard>

                {/* System Health */}
                <BentoCard delay={0.3} className="md:col-span-2 lg:col-span-2 flex-row items-center gap-6 !p-0">
                    <div className="h-full w-1/3 bg-gradient-to-r from-[var(--success-500)]/20 to-transparent p-6 flex flex-col justify-center border-r border-[var(--border-primary)]">
                        <ShieldCheck size={32} className="text-[var(--success-400)] mb-3" />
                        <span className="font-bold text-lg text-[var(--text-primary)]">99.9%</span>
                        <span className="text-xs text-[var(--text-tertiary)]">Uptime</span>
                    </div>
                    <div className="flex-1 p-6 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-[var(--text-tertiary)] mb-1">Server Response</p>
                            <p className="font-mono text-[var(--text-primary)]">45ms</p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-tertiary)] mb-1">Database</p>
                            <p className="font-mono text-[var(--success-400)]">Healthy</p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-tertiary)] mb-1">Last Backup</p>
                            <p className="font-mono text-[var(--text-primary)]">2h ago</p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-tertiary)] mb-1">Version</p>
                            <p className="font-mono text-[var(--text-primary)]">v2.4.0</p>
                        </div>
                    </div>
                </BentoCard>

            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Users List */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-[var(--text-primary)]">New Roomies</h3>
                        <button className="text-sm text-[var(--primary-400)] hover:text-[var(--primary-300)] font-medium">
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 bg-[var(--bg-tertiary)] rounded-2xl animate-pulse" />
                            ))
                        ) : (
                            recentUsers.map((user, i) => (
                                <motion.div
                                    key={user.uid}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)] transition-colors group cursor-pointer border border-transparent hover:border-[var(--border-secondary)]"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--primary-500)] to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20 overflow-hidden flex-shrink-0">
                                        {user.profilePictureUrl ? (
                                            <img src={user.profilePictureUrl} alt={user.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            user.fullName?.[0]
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-[var(--text-primary)]">{user.fullName}</h4>
                                            {user.profileCompleted && (
                                                <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                                            )}
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)]">{user.city || 'No Location'}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-xs font-medium border",
                                            user.isActive
                                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                        )}>
                                            {user.isActive ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Recent Rooms List */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl p-6 flex flex-col"
                >
                    <h3 className="font-bold text-lg text-[var(--text-primary)] mb-6">Latest Listings</h3>

                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-20 bg-[var(--bg-tertiary)] rounded-2xl animate-pulse" />
                            ))
                        ) : (
                            recentRooms.map((room, i) => (
                                <div key={room.id} className="p-4 rounded-2xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] hover:border-[var(--primary-500)]/30 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-medium text-[var(--text-primary)]">{room.city}</span>
                                        <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                                            <Clock size={10} /> {formatTimeAgo(room.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-[var(--text-secondary)]">{room.sizeOfPlace}</p>
                                            <span className={cn(
                                                "text-[10px] px-1.5 py-0.5 rounded border mt-2 inline-block",
                                                room.userType === 'Tenant'
                                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                    : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                            )}>
                                                {room.userType}
                                            </span>
                                        </div>
                                        <p className="font-bold text-[var(--primary-400)]">₹{room.rentPerHead}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
