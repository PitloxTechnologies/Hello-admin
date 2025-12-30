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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
            <div className="card mb-8 p-4 bg-[var(--bg-secondary)]/50 backdrop-blur-sm">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--primary-400)] mb-1">{rooms.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Total Rooms</p>
                </div>
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--success-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--success-400)] mb-1">
                        {rooms.filter(r => r.userType === UserType.TENANT).length}
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Tenants</p>
                </div>
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--accent-400)] mb-1">
                        {rooms.filter(r => r.userType === UserType.OWNER).length}
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Owners</p>
                </div>
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--warning-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--warning-400)] mb-1">{filteredRooms.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Filtered Results</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className="card group cursor-pointer hover:shadow-xl hover:shadow-[var(--primary-500)]/10 hover:border-[var(--primary-500)]/30"
                        >
                            {/* Image Placeholder */}
                            <div className="h-48 rounded-t-xl bg-[var(--bg-tertiary)] overflow-hidden relative">
                                {room.imageUrls && room.imageUrls.length > 0 ? (
                                    <img
                                        src={room.imageUrls[0]}
                                        alt={room.city}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)] bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]">
                                        <ImageIcon size={48} className="opacity-50" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className={`badge ${room.userType === UserType.TENANT ? 'badge-info' : 'badge-purple'} shadow-lg backdrop-blur-md`}>
                                        {room.userType}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />
                            </div>

                            <div className="p-4 relative">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className="font-semibold text-[var(--text-primary)] truncate text-lg">{room.city}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5 truncate">
                                            <MapPin size={14} className="flex-shrink-0 text-[var(--primary-400)]" />
                                            {room.nearbyLandmark}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-lg font-bold text-[var(--primary-400)]">
                                            ₹{room.rentPerHead?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 h-10">
                                    {room.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-primary)]">
                                    <span className="text-xs font-medium text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-md">
                                        {room.sizeOfPlace}
                                    </span>
                                    <span className="text-xs text-[var(--text-tertiary)]">{formatTimeAgo(room.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="w-16">Image</th>
                                <th>City</th>
                                <th>Landmark</th>
                                <th>Type</th>
                                <th>Rent/Head</th>
                                <th>Size</th>
                                <th>Created</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRooms.map((room) => (
                                <tr
                                    key={room.id}
                                    onClick={() => setSelectedRoom(room)}
                                    className="cursor-pointer group"
                                >
                                    <td>
                                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden">
                                            {room.imageUrls && room.imageUrls.length > 0 ? (
                                                <img src={room.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="font-medium text-[var(--text-primary)]">{room.city}</td>
                                    <td className="text-[var(--text-secondary)]">{room.nearbyLandmark}</td>
                                    <td>
                                        <span className={`badge ${room.userType === UserType.TENANT ? 'badge-info' : 'badge-purple'}`}>
                                            {room.userType}
                                        </span>
                                    </td>
                                    <td className="font-medium text-[var(--primary-400)]">₹{room.rentPerHead?.toLocaleString()}</td>
                                    <td className="text-[var(--text-secondary)]">{room.sizeOfPlace}</td>
                                    <td className="text-[var(--text-tertiary)] text-xs">{formatTimeAgo(room.createdAt)}</td>
                                    <td>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id); }}
                                            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--error-400)] hover:bg-[var(--error-400)]/10 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Room Detail Modal */}
            {selectedRoom && (
                <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
                    <div className="modal max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Room Details</h2>
                            <button
                                onClick={() => setSelectedRoom(null)}
                                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden lg:grid lg:grid-cols-2">
                            {/* Left: Images */}
                            <div className="bg-black/20 p-6 flex items-center justify-center overflow-auto h-64 lg:h-auto border-b lg:border-b-0 lg:border-r border-[var(--border-primary)]">
                                {selectedRoom.imageUrls && selectedRoom.imageUrls.length > 0 ? (
                                    <img
                                        src={selectedRoom.imageUrls[0]}
                                        alt={selectedRoom.city}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-[var(--text-tertiary)]">
                                        <ImageIcon size={64} className="opacity-50" />
                                        <p>No images available</p>
                                    </div>
                                )}
                            </div>

                            {/* Right: Info */}
                            <div className="p-8 overflow-y-auto">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                            {selectedRoom.city}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] flex items-center gap-2">
                                            <MapPin size={18} className="text-[var(--primary-400)]" />
                                            Near {selectedRoom.nearbyLandmark}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-[var(--primary-400)]">
                                            ₹{selectedRoom.rentPerHead?.toLocaleString()}
                                        </div>
                                        <p className="text-sm text-[var(--text-tertiary)]">per month/head</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mb-8">
                                    <span className={`badge px-3 py-1 text-sm ${selectedRoom.userType === UserType.TENANT ? 'badge-info' : 'badge-purple'}`}>
                                        {selectedRoom.userType}
                                    </span>
                                    <span className="badge badge-success px-3 py-1 text-sm">{selectedRoom.sizeOfPlace}</span>
                                    <span className="badge bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-primary)] px-3 py-1 text-sm">
                                        {formatTimeAgo(selectedRoom.createdAt)}
                                    </span>
                                </div>

                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Description</h4>
                                    <p className="text-[var(--text-primary)] leading-relaxed text-lg bg-[var(--bg-tertiary)]/30 p-4 rounded-xl border border-[var(--border-primary)]">
                                        {selectedRoom.description}
                                    </p>
                                </div>

                                {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Amenities</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRoom.amenities.map((amenity, i) => (
                                                <span key={i} className="badge badge-info px-3 py-1">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={() => handleDeleteRoom(selectedRoom.id)}
                                className="btn btn-danger"
                            >
                                <Trash2 size={18} />
                                Delete Room
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
