'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Eye,
    Trash2,
    MapPin,
    X,
    UserCheck,
    ShieldAlert,
    ShieldCheck
} from 'lucide-react';
import { DataTable } from '../components';
import { usersApi } from '../api/users';
import { User, Gender } from '../api/types';
import { cn } from '../lib/utils';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        city: '',
        gender: '',
        roomStatus: '',
        isActive: '',
        profileCompleted: '',
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await usersApi.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (uid: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await usersApi.removeUser(uid);
            setUsers(users.filter(u => u.uid !== uid));
            setSelectedUser(null);
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => {
        if (filters.city && !user.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
        if (filters.gender && user.gender !== filters.gender) return false;
        if (filters.roomStatus && user.roomStatus !== filters.roomStatus) return false;
        if (filters.isActive === 'true' && !user.isActive) return false;
        if (filters.isActive === 'false' && user.isActive) return false;
        if (filters.profileCompleted === 'true' && !user.profileCompleted) return false;
        if (filters.profileCompleted === 'false' && user.profileCompleted) return false;
        return true;
    });

    const columns = [
        {
            key: 'fullName',
            label: 'User',
            render: (user: User) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-600)] to-violet-600 flex items-center justify-center text-white font-medium shadow-md shadow-indigo-500/20">
                        {user.fullName?.charAt(0) || user.displayName?.charAt(0) || '?'}
                    </div>
                    <div>
                        <p className="font-medium text-[var(--text-primary)]">
                            {user.fullName || user.displayName || 'Unknown'}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)] font-mono">{user.phoneNumber}</p>
                    </div>
                </div>
            ),
            sortable: true,
        },
        {
            key: 'city',
            label: 'Location',
            render: (user: User) => (
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                    <MapPin size={14} className="text-[var(--text-tertiary)]" />
                    <span>{user.city || 'Not set'}</span>
                </div>
            ),
            sortable: true,
        },
        {
            key: 'gender',
            label: 'Gender',
            render: (user: User) => (
                <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                    user.gender === Gender.MALE ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        user.gender === Gender.FEMALE ? "bg-pink-500/10 text-pink-400 border-pink-500/20" :
                            "bg-slate-500/10 text-slate-400 border-slate-500/20"
                )}>
                    {user.gender || 'Not set'}
                </span>
            ),
        },
        {
            key: 'roomStatus',
            label: 'Status',
            render: (user: User) => (
                <span className="text-sm text-[var(--text-secondary)]">
                    {user.roomStatus || '-'}
                </span>
            ),
        },
        {
            key: 'profileCompleted',
            label: 'Profile',
            render: (user: User) => (
                <div className="flex items-center gap-2">
                    {user.profileCompleted ? (
                        <ShieldCheck size={16} className="text-[var(--success-400)]" />
                    ) : (
                        <ShieldAlert size={16} className="text-[var(--warning-400)]" />
                    )}
                    <span className={cn(
                        "text-xs",
                        user.profileCompleted ? "text-[var(--success-400)]" : "text-[var(--warning-400)]"
                    )}>
                        {user.profileCompleted ? 'Complete' : 'Pending'}
                    </span>
                </div>
            ),
        },
        {
            key: 'isActive',
            label: 'Account',
            render: (user: User) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        user.isActive ? "bg-[var(--success-400)] shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-[var(--bg-elevated)]"
                    )} />
                    <span className="text-sm text-[var(--text-secondary)]">
                        {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">User Management</h1>
                    <p className="text-[var(--text-secondary)] text-sm">Monitor and manage user accounts</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "btn border border-[var(--border-primary)]",
                            showFilters ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]" : "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        )}
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="card p-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[var(--text-primary)]">Filters</h3>
                        <button
                            onClick={() => setFilters({ city: '', gender: '', roomStatus: '', isActive: '', profileCompleted: '' })}
                            className="text-sm text-[var(--primary-400)] hover:text-[var(--primary-300)]"
                        >
                            Reset Filters
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">City</label>
                            <input
                                type="text"
                                placeholder="e.g. Mumbai"
                                value={filters.city}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Gender</label>
                            <select
                                value={filters.gender}
                                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                                className="input"
                            >
                                <option value="">All Genders</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Requirement</label>
                            <select
                                value={filters.roomStatus}
                                onChange={(e) => setFilters({ ...filters, roomStatus: e.target.value })}
                                className="input"
                            >
                                <option value="">All</option>
                                <option value="I have Room">Has Room</option>
                                <option value="I need Room">Needs Room</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Status</label>
                            <select
                                value={filters.isActive}
                                onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                                className="input"
                            >
                                <option value="">All Accounts</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Profile Status</label>
                            <select
                                value={filters.profileCompleted}
                                onChange={(e) => setFilters({ ...filters, profileCompleted: e.target.value })}
                                className="input"
                            >
                                <option value="">All Profiles</option>
                                <option value="true">Completed</option>
                                <option value="false">Incomplete</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: users.length, color: 'text-[var(--primary-400)]' },
                    { label: 'Active Now', value: users.filter(u => u.isActive).length, color: 'text-[var(--success-400)]' },
                    { label: 'Verified', value: users.filter(u => u.profileCompleted).length, color: 'text-[var(--accent-400)]' },
                    { label: 'Filtered', value: filteredUsers.length, color: 'text-[var(--warning-400)]' },
                ].map((stat, i) => (
                    <div key={i} className="card p-4 border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50">
                        <p className={cn("text-2xl font-bold mb-1", stat.color)}>{stat.value}</p>
                        <p className="text-sm text-[var(--text-tertiary)]">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Data Table */}
            <div className="card shadow-sm border border-[var(--border-primary)] overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    loading={loading}
                    searchPlaceholder="Search by name, phone, or email..."
                    onRowClick={setSelectedUser}
                    rowId="uid"
                    actions={(user) => (
                        <div className="flex items-center justify-end gap-1">
                            <button
                                onClick={() => setSelectedUser(user)}
                                className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                title="View details"
                            >
                                <Eye size={16} />
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user.uid)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                                title="Delete user"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                    emptyMessage="No users found matching your criteria"
                />
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
                    <div className="w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">User Profile</h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="flex items-start gap-5 mb-8">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary-600)] to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/20">
                                    {selectedUser.fullName?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1 pt-1">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                                        {selectedUser.fullName || selectedUser.displayName}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] flex items-center gap-2 mb-3">
                                        <span className="font-mono text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">{selectedUser.phoneNumber}</span>
                                        {selectedUser.email && (
                                            <span>• {selectedUser.email}</span>
                                        )}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("badge", selectedUser.isActive ? "badge-success" : "badge-error")}>
                                            {selectedUser.isActive ? 'Active' : 'Deactivated'}
                                        </span>
                                        <span className={cn("badge", selectedUser.profileCompleted ? "badge-success" : "badge-warning")}>
                                            {selectedUser.profileCompleted ? 'Verified' : 'Unverified'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Location</h4>
                                    <p className="text-[var(--text-primary)] border-l-2 border-[var(--border-accent)] pl-3">{selectedUser.city || 'Not specified'}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Hometown</h4>
                                    <p className="text-[var(--text-primary)] border-l-2 border-[var(--border-primary)] pl-3">{selectedUser.hometown || 'Not specified'}</p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Demographics</h4>
                                    <div className="flex gap-4 text-sm">
                                        <div>
                                            <span className="text-[var(--text-tertiary)] block text-xs">Gender</span>
                                            <span className="text-[var(--text-primary)]">{selectedUser.gender || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--text-tertiary)] block text-xs">Age</span>
                                            <span className="text-[var(--text-primary)]">{selectedUser.age || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Requirement</h4>
                                    <p className="text-[var(--text-primary)]">{selectedUser.roomStatus || '-'}</p>
                                </div>

                                <div className="col-span-2">
                                    <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Bio</h4>
                                    <p className="text-[var(--text-secondary)] bg-[var(--bg-tertiary)] p-3 rounded-xl text-sm leading-relaxed">
                                        {selectedUser.introduction || 'No introduction provided.'}
                                    </p>
                                </div>

                                {selectedUser.interests && selectedUser.interests.length > 0 && (
                                    <div className="col-span-2">
                                        <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Interests</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUser.interests.map((interest, i) => (
                                                <span key={i} className="px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-sm text-[var(--text-secondary)]">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-[var(--border-primary)] flex justify-end gap-3 bg-[var(--bg-tertiary)]/30 rounded-b-2xl">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="btn btn-secondary"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleDeleteUser(selectedUser.uid)}
                                className="btn btn-danger"
                            >
                                <Trash2 size={16} />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
