'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    Sparkles
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/rooms', label: 'Rooms', icon: Home },
    { href: '/used-items', label: 'Used Items', icon: Package },
    { href: '/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] lg:hidden"
            >
                <Menu size={24} />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-primary)]
          flex flex-col z-50 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-[var(--border-primary)]">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] flex items-center justify-center">
                                <Sparkles size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-[var(--text-primary)]">Hello Roomie</h1>
                                <p className="text-xs text-[var(--text-tertiary)]">Admin Panel</p>
                            </div>
                        </div>
                    )}

                    {isCollapsed && (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] flex items-center justify-center mx-auto">
                            <Sparkles size={22} className="text-white" />
                        </div>
                    )}

                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] lg:hidden"
                    >
                        <X size={20} />
                    </button>

                    {/* Collapse button for desktop */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`
              hidden lg:flex p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-transform
              ${isCollapsed ? 'rotate-180 mx-auto mt-4' : ''}
            `}
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${isActive
                                        ? 'bg-gradient-to-r from-[rgba(6,182,212,0.15)] to-[rgba(168,85,247,0.1)] text-[var(--primary-400)] border border-[var(--border-accent)]'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                                    }
                  ${isCollapsed ? 'justify-center px-3' : ''}
                `}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon size={20} className={isActive ? 'text-[var(--primary-400)]' : ''} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--border-primary)] space-y-1">
                    <Link
                        href="/settings"
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
              text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]
              ${isCollapsed ? 'justify-center px-3' : ''}
            `}
                        title={isCollapsed ? 'Settings' : undefined}
                    >
                        <Settings size={20} />
                        {!isCollapsed && <span>Settings</span>}
                    </Link>

                    <button
                        className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
              text-[var(--error-400)] hover:bg-[rgba(239,68,68,0.1)]
              ${isCollapsed ? 'justify-center px-3' : ''}
            `}
                        title={isCollapsed ? 'Logout' : undefined}
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
