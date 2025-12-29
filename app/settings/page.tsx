'use client';

import { useState } from 'react';
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Database,
    Save,
    Check
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'api', label: 'API Settings', icon: Database },
    ];

    return (
        <div className="max-w-4xl mx-auto pt-12 lg:pt-0">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your admin panel preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-56 flex-shrink-0">
                    <div className="card p-2 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-[rgba(6,182,212,0.15)] to-[rgba(168,85,247,0.1)] text-[var(--primary-400)]'
                                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1">
                    <div className="card">
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">General Settings</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                                Admin Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Hello Roomie Admin"
                                                className="input"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                                Admin Email
                                            </label>
                                            <input
                                                type="email"
                                                defaultValue="admin@helloroomie.com"
                                                className="input"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                                Timezone
                                            </label>
                                            <select className="input">
                                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                                <option value="America/New_York">America/New York (EST)</option>
                                                <option value="Europe/London">Europe/London (GMT)</option>
                                                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                                Default Items Per Page
                                            </label>
                                            <select className="input">
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Notification Preferences</h2>

                                <div className="space-y-4">
                                    {[
                                        { label: 'Email Notifications', desc: 'Receive email updates for important events' },
                                        { label: 'New User Alerts', desc: 'Get notified when new users register' },
                                        { label: 'Room Listing Alerts', desc: 'Get notified when new rooms are listed' },
                                        { label: 'Weekly Reports', desc: 'Receive weekly summary reports via email' },
                                        { label: 'Security Alerts', desc: 'Get notified about suspicious activities' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-tertiary)]">
                                            <div>
                                                <p className="font-medium text-[var(--text-primary)]">{item.label}</p>
                                                <p className="text-sm text-[var(--text-tertiary)]">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-[var(--bg-hover)] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-500)]"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Security Settings</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            className="input"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            className="input"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            className="input"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-[var(--border-primary)]">
                                        <h3 className="font-medium text-[var(--text-primary)] mb-4">Two-Factor Authentication</h3>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-tertiary)]">
                                            <div>
                                                <p className="font-medium text-[var(--text-primary)]">Enable 2FA</p>
                                                <p className="text-sm text-[var(--text-tertiary)]">Add an extra layer of security</p>
                                            </div>
                                            <button className="btn btn-secondary">Setup</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Settings */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Appearance</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                                            Theme
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Dark', 'Light', 'System'].map((theme) => (
                                                <button
                                                    key={theme}
                                                    className={`p-4 rounded-xl border-2 transition-all ${theme === 'Dark'
                                                            ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/10'
                                                            : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                                                        }`}
                                                >
                                                    <p className="font-medium text-[var(--text-primary)]">{theme}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                                            Accent Color
                                        </label>
                                        <div className="flex gap-3">
                                            {['#06b6d4', '#a855f7', '#22c55e', '#f59e0b', '#ef4444'].map((color) => (
                                                <button
                                                    key={color}
                                                    className={`w-10 h-10 rounded-full border-2 ${color === '#06b6d4'
                                                            ? 'border-white scale-110'
                                                            : 'border-transparent'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-tertiary)]">
                                        <div>
                                            <p className="font-medium text-[var(--text-primary)]">Compact Mode</p>
                                            <p className="text-sm text-[var(--text-tertiary)]">Reduce spacing and padding</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-[var(--bg-hover)] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-500)]"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* API Settings */}
                        {activeTab === 'api' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">API Configuration</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            API Base URL
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="http://localhost:3000"
                                            className="input font-mono text-sm"
                                        />
                                        <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                                            Set via NEXT_PUBLIC_API_URL environment variable
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-medium text-[var(--text-primary)]">Connection Status</p>
                                            <span className="badge badge-success flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-[var(--success-400)]" />
                                                Connected
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-tertiary)]">
                                            Last checked: Just now
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            Request Timeout (ms)
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="30000"
                                            className="input"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-[var(--border-primary)] flex justify-end">
                            <button
                                onClick={handleSave}
                                className="btn btn-primary"
                            >
                                {saved ? (
                                    <>
                                        <Check size={18} />
                                        Saved!
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
