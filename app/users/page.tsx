'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    MapPin,
    Phone,
    Mail,
    Calendar,
    X,
    Check
} from 'lucide-react';
import { DataTable } from '../components';
import { usersApi } from '../api/users';
import { User, Gender } from '../api/types';

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
                    <div className="avatar">
                        {user.fullName?.charAt(0) || user.displayName?.charAt(0) || '?'}
                    </div>
                    <div>
                        <p className="font-medium text-[var(--text-primary)]">
                            {user.fullName || user.displayName || 'Unknown'}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)]">{user.phoneNumber}</p>
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
                    <MapPin size={14} />
                    <span>{user.city || 'Not set'}</span>
                </div>
            ),
            sortable: true,
        },
        {
            key: 'gender',
            label: 'Gender',
            render: (user: User) => (
                <span className={`badge ${user.gender === Gender.MALE ? 'badge-info' :
                        user.gender === Gender.FEMALE ? 'badge-purple' :
                            'badge-warning'
                    }`}>
                    {user.gender || 'Not set'}
                </span>
            ),
        },
        {
            key: 'roomStatus',
            label: 'Room Status',
            render: (user: User) => (
                <span className="text-sm text-[var(--text-secondary)]">
                    {user.roomStatus || 'Not set'}
                </span>
            ),
        },
        {
            key: 'profileCompleted',
            label: 'Profile',
            render: (user: User) => (
                <span className={`badge ${user.profileCompleted ? 'badge-success' : 'badge-warning'}`}>
                    {user.profileCompleted ? 'Complete' : 'Incomplete'}
                </span>
            ),
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (user: User) => (
                <div className="flex items-center gap-2">
                    <div className={`status-indicator ${user.isActive ? 'online' : 'offline'}`} />
                    <span className="text-sm text-[var(--text-secondary)]">
                        {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-7xl mx-auto pt-12 lg:pt-0">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="page-title">Users</h1>
                    <p className="page-subtitle">Manage all registered users</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="card mb-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[var(--text-primary)]">Filters</h3>
                        <button
                            onClick={() => setFilters({ city: '', gender: '', roomStatus: '', isActive: '', profileCompleted: '' })}
                            className="text-sm text-[var(--primary-400)] hover:text-[var(--primary-300)]"
                        >
                            Clear all
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">City</label>
                            <input
                                type="text"
                                placeholder="Filter by city"
                                value={filters.city}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">Gender</label>
                            <select
                                value={filters.gender}
                                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                                className="input"
                            >
                                <option value="">All</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">Room Status</label>
                            <select
                                value={filters.roomStatus}
                                onChange={(e) => setFilters({ ...filters, roomStatus: e.target.value })}
                                className="input"
                            >
                                <option value="">All</option>
                                <option value="I have Room">I have Room</option>
                                <option value="I need Room">I need Room</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">Status</label>
                            <select
                                value={filters.isActive}
                                onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                                className="input"
                            >
                                <option value="">All</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">Profile</label>
                            <select
                                value={filters.profileCompleted}
                                onChange={(e) => setFilters({ ...filters, profileCompleted: e.target.value })}
                                className="input"
                            >
                                <option value="">All</option>
                                <option value="true">Complete</option>
                                <option value="false">Incomplete</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--primary-400)]">{users.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Total Users</p>
                </div>
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--success-400)]">{users.filter(u => u.isActive).length}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Active Users</p>
                </div>
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--accent-400)]">{users.filter(u => u.profileCompleted).length}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Complete Profiles</p>
                </div>
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--warning-400)]">{filteredUsers.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Filtered Results</p>
                </div>
            </div>

            {/* Data Table */}
            <div className="card">
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    loading={loading}
                    searchPlaceholder="Search users by name, phone, city..."
                    onRowClick={setSelectedUser}
                    actions={(user) => (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setSelectedUser(user)}
                                className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                title="View details"
                            >
                                <Eye size={16} />
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user.uid)}
                                className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[var(--text-secondary)] hover:text-[var(--error-400)]"
                                title="Delete user"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                    emptyMessage="No users found"
                />
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">User Details</h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)]"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-primary)]">
                                <div className="avatar avatar-lg">
                                    {selectedUser.fullName?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                        {selectedUser.fullName || selectedUser.displayName}
                                    </h3>
                                    <p className="text-[var(--text-secondary)]">{selectedUser.email || 'No email'}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`badge ${selectedUser.isActive ? 'badge-success' : 'badge-error'}`}>
                                            {selectedUser.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className={`badge ${selectedUser.profileCompleted ? 'badge-success' : 'badge-warning'}`}>
                                            {selectedUser.profileCompleted ? 'Profile Complete' : 'Profile Incomplete'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-[var(--text-tertiary)] mb-1">Phone</p>
                                    <p className="text-[var(--text-primary)]">{selectedUser.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-tertiary)] mb-1">City</p>
                                    <p className="text-[var(--text-primary)]">{selectedUser.city || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-tertiary)] mb-1">Gender</p>
                                    <p className="text-[var(--text-primary)]">{selectedUser.gender || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-tertiary)] mb-1">Age</p>
                                    <p className="text-[var(--text-primary)]">{selectedUser.age || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-tertiary)] mb-1">Room Status</p>
                                    <p className="text-[var(--text-primary)]">{selectedUser.roomStatus || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-tertiary)] mb-1">Hometown</p>
                                    <p className="text-[var(--text-primary)]">{selectedUser.hometown || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-[var(--text-tertiary)] mb-1">Introduction</p>
                                    <p className="text-[var(--text-primary)]">{selectedUser.introduction || '-'}</p>
                                </div>
                                {selectedUser.interests && selectedUser.interests.length > 0 && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-[var(--text-tertiary)] mb-2">Interests</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUser.interests.map((interest, i) => (
                                                <span key={i} className="badge badge-info">{interest}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setSelectedUser(null)} className="btn btn-secondary">
                                Close
                            </button>
                            <button
                                onClick={() => handleDeleteUser(selectedUser.uid)}
                                className="btn btn-danger"
                            >
                                <Trash2 size={16} />
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
