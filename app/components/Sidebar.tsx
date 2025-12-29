'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Home,
    Package,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    Sparkles,
    Command
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/rooms', label: 'Rooms', icon: Home },
    { href: '/used-items', label: 'Marketplace', icon: Package },
    { href: '/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] shadow-lg text-[var(--text-primary)]"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? 80 : 280,
                    x: isMobileOpen ? 0 : 0
                }}
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 bg-[var(--bg-primary)]",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl shadow-xl overflow-hidden relative">

                    {/* Header */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
                                <Sparkles size={20} className="text-white" />
                            </div>

                            <AnimatePresence mode="popLayout">
                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col"
                                    >
                                        <span className="font-bold text-lg text-[var(--text-primary)] whitespace-nowrap">
                                            Hello Roomie
                                        </span>
                                        <span className="text-xs text-[var(--text-tertiary)] font-medium">
                                            Admin Workspace
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Collapse Button (Desktop) */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden lg:flex p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors absolute right-4 top-8"
                            style={{ right: isCollapsed ? 'auto' : '1.5rem', left: isCollapsed ? '50%' : 'auto', transform: isCollapsed ? 'translateX(-50%)' : 'none' }}
                        >
                            <div className={cn("transition-transform duration-300", isCollapsed ? "rotate-180" : "")}>
                                <ChevronLeft size={18} />
                            </div>
                        </button>

                        {/* Close Button (Mobile) */}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                        >
                            <X size={20} />
                        </button>

                    </div>

                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-4 mb-4"
                        >
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                                <Command size={16} className="text-[var(--text-tertiary)]" />
                                <span className="text-xs text-[var(--text-tertiary)]">Search...</span>
                                <span className="ml-auto text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded border border-[var(--border-secondary)]">⌘K</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto py-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/' && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "text-[var(--primary-400)]"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--accent-500)]/10 border border-[var(--primary-500)]/20 rounded-xl"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    <div className={cn(
                                        "flex items-center gap-3 relative z-10 w-full",
                                        isCollapsed && "justify-center"
                                    )}>
                                        <Icon size={20} className={cn(
                                            "shrink-0 transition-colors",
                                            isActive ? "text-[var(--primary-400)]" : "group-hover:text-[var(--text-primary)]"
                                        )} />

                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </div>

                                    {isActive && !isCollapsed && (
                                        <motion.div
                                            layoutId="activeGlow"
                                            className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[var(--primary-400)] shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-[var(--border-primary)] space-y-1 bg-[var(--bg-tertiary)]/30 backdrop-blur-md">
                        <Link
                            href="/settings"
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all",
                                isCollapsed && "justify-center"
                            )}
                        >
                            <Settings size={20} />
                            {!isCollapsed && <span>Settings</span>}
                        </Link>

                        <button
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm text-[var(--error-400)] hover:bg-[var(--error-500)]/10 transition-all",
                                isCollapsed && "justify-center"
                            )}
                        >
                            <LogOut size={20} />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
