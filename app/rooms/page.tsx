'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Plus,
    Eye,
    Trash2,
    MapPin,
    Home,
    DollarSign,
    User,
    Calendar,
    X,
    Grid,
    List,
    Image as ImageIcon
} from 'lucide-react';
import { roomsApi } from '../api/rooms';
import { Room, UserType } from '../api/types';

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        city: '',
        userType: '',
        minRent: '',
        maxRent: '',
    });

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            setLoading(true);
            const data = await roomsApi.getRooms();
            setRooms(data);
        } catch (error) {
            console.error('Failed to load rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async (id: string) => {
        if (!confirm('Are you sure you want to delete this room?')) return;

        try {
            await roomsApi.deleteRoom(id);
            setRooms(rooms.filter(r => r.id !== id));
            setSelectedRoom(null);
        } catch (error) {
            console.error('Failed to delete room:', error);
            alert('Failed to delete room');
        }
    };

    const filteredRooms = rooms.filter(room => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!room.city?.toLowerCase().includes(query) &&
                !room.nearbyLandmark?.toLowerCase().includes(query) &&
                !room.description?.toLowerCase().includes(query)) {
                return false;
            }
        }
        if (filters.city && !room.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
        if (filters.userType && room.userType !== filters.userType) return false;
        if (filters.minRent && room.rentPerHead < parseInt(filters.minRent)) return false;
        if (filters.maxRent && room.rentPerHead > parseInt(filters.maxRent)) return false;
        return true;
    });

    const formatTimeAgo = (date?: Date) => {
        if (!date) return 'Unknown';
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    return (
        <div className="max-w-7xl mx-auto pt-12 lg:pt-0">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="page-title">Rooms</h1>
                    <p className="page-subtitle">Manage all room listings</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="tabs">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`tab ${viewMode === 'grid' ? 'active' : ''}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`tab ${viewMode === 'list' ? 'active' : ''}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="card mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search rooms by city, landmark, description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={filters.userType}
                            onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                            className="input w-auto"
                        >
                            <option value="">All Types</option>
                            <option value="Tenant">Tenant</option>
                            <option value="Owner">Owner</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Min Rent"
                            value={filters.minRent}
                            onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                            className="input w-32"
                        />
                        <input
                            type="number"
                            placeholder="Max Rent"
                            value={filters.maxRent}
                            onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                            className="input w-32"
                        />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--primary-400)]">{rooms.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Total Rooms</p>
                </div>
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--success-400)]">
                        {rooms.filter(r => r.userType === UserType.TENANT).length}
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)]">Tenants</p>
                </div>
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--accent-400)]">
                        {rooms.filter(r => r.userType === UserType.OWNER).length}
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)]">Owners</p>
                </div>
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--warning-400)]">{filteredRooms.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Filtered Results</p>
                </div>
            </div>

            {/* Rooms Grid/List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="loading-spinner" />
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Home size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">No rooms found</h3>
                        <p className="text-[var(--text-secondary)]">Try adjusting your filters</p>
                    </div>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="data-grid">
                    {filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className="card hover:border-[var(--border-accent)] cursor-pointer group"
                        >
                            {/* Image Placeholder */}
                            <div className="h-40 -mx-6 -mt-6 mb-4 rounded-t-xl bg-[var(--bg-tertiary)] overflow-hidden relative">
                                {room.imageUrls && room.imageUrls.length > 0 ? (
                                    <img
                                        src={room.imageUrls[0]}
                                        alt={room.city}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <span className={`absolute top-3 left-3 badge ${room.userType === UserType.TENANT ? 'badge-info' : 'badge-purple'
                                    }`}>
                                    {room.userType}
                                </span>
                            </div>

                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">{room.city}</h3>
                                    <p className="text-sm text-[var(--text-tertiary)] flex items-center gap-1">
                                        <MapPin size={14} />
                                        {room.nearbyLandmark}
                                    </p>
                                </div>
                                <p className="text-xl font-bold text-[var(--primary-400)]">
                                    ₹{room.rentPerHead?.toLocaleString()}
                                </p>
                            </div>

                            <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                                {room.description}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
                                <span className="text-xs text-[var(--text-tertiary)]">{room.sizeOfPlace}</span>
                                <span className="text-xs text-[var(--text-tertiary)]">{formatTimeAgo(room.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card p-0">
                    <div className="space-y-0">
                        {filteredRooms.map((room, index) => (
                            <div
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                className={`flex items-center gap-4 p-4 hover:bg-[var(--bg-tertiary)] cursor-pointer ${index !== filteredRooms.length - 1 ? 'border-b border-[var(--border-primary)]' : ''
                                    }`}
                            >
                                <div className="w-20 h-20 rounded-xl bg-[var(--bg-tertiary)] overflow-hidden flex-shrink-0">
                                    {room.imageUrls && room.imageUrls.length > 0 ? (
                                        <img
                                            src={room.imageUrls[0]}
                                            alt={room.city}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-[var(--text-primary)]">{room.city}</h3>
                                        <span className={`badge ${room.userType === UserType.TENANT ? 'badge-info' : 'badge-purple'
                                            }`}>
                                            {room.userType}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--text-tertiary)] mb-1">
                                        Near {room.nearbyLandmark} • {room.sizeOfPlace}
                                    </p>
                                    <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                                        {room.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-[var(--primary-400)]">
                                        ₹{room.rentPerHead?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-[var(--text-tertiary)]">/month</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id); }}
                                    className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[var(--text-tertiary)] hover:text-[var(--error-400)]"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Room Detail Modal */}
            {selectedRoom && (
                <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
                    <div className="modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Room Details</h2>
                            <button
                                onClick={() => setSelectedRoom(null)}
                                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)]"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Image Gallery */}
                            {selectedRoom.imageUrls && selectedRoom.imageUrls.length > 0 && (
                                <div className="h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
                                    <img
                                        src={selectedRoom.imageUrls[0]}
                                        alt={selectedRoom.city}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                                        {selectedRoom.city}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] flex items-center gap-1">
                                        <MapPin size={16} />
                                        Near {selectedRoom.nearbyLandmark}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-[var(--primary-400)]">
                                        ₹{selectedRoom.rentPerHead?.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-[var(--text-tertiary)]">per month/head</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <span className={`badge ${selectedRoom.userType === UserType.TENANT ? 'badge-info' : 'badge-purple'
                                    }`}>
                                    {selectedRoom.userType}
                                </span>
                                <span className="badge badge-success">{selectedRoom.sizeOfPlace}</span>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-[var(--text-tertiary)] mb-2">Description</h4>
                                <p className="text-[var(--text-primary)]">{selectedRoom.description}</p>
                            </div>

                            {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-[var(--text-tertiary)] mb-2">Amenities</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRoom.amenities.map((amenity, i) => (
                                            <span key={i} className="badge badge-info">{amenity}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setSelectedRoom(null)} className="btn btn-secondary">
                                Close
                            </button>
                            <button
                                onClick={() => handleDeleteRoom(selectedRoom.id)}
                                className="btn btn-danger"
                            >
                                <Trash2 size={16} />
                                Delete Room
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
