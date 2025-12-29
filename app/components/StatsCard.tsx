'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'cyan' | 'purple' | 'green' | 'orange' | 'red';
}

const colorClasses = {
    cyan: {
        bg: 'from-cyan-500/20 to-cyan-500/5',
        icon: 'bg-cyan-500/20 text-cyan-400',
        trend: 'text-cyan-400',
    },
    purple: {
        bg: 'from-purple-500/20 to-purple-500/5',
        icon: 'bg-purple-500/20 text-purple-400',
        trend: 'text-purple-400',
    },
    green: {
        bg: 'from-emerald-500/20 to-emerald-500/5',
        icon: 'bg-emerald-500/20 text-emerald-400',
        trend: 'text-emerald-400',
    },
    orange: {
        bg: 'from-orange-500/20 to-orange-500/5',
        icon: 'bg-orange-500/20 text-orange-400',
        trend: 'text-orange-400',
    },
    red: {
        bg: 'from-red-500/20 to-red-500/5',
        icon: 'bg-red-500/20 text-red-400',
        trend: 'text-red-400',
    },
};

export default function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = 'cyan'
}: StatsCardProps) {
    const colors = colorClasses[color];

    return (
        <div className="stat-card group">
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity rounded-xl`} />

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-[var(--text-secondary)] text-sm font-medium mb-1">{title}</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)] mb-1">{value}</p>

                    {(subtitle || trend) && (
                        <div className="flex items-center gap-2">
                            {trend && (
                                <span className={`text-sm font-medium ${trend.isPositive ? 'text-[var(--success-400)]' : 'text-[var(--error-400)]'}`}>
                                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                                </span>
                            )}
                            {subtitle && (
                                <span className="text-sm text-[var(--text-tertiary)]">{subtitle}</span>
                            )}
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-xl ${colors.icon}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}
