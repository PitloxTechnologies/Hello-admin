'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Eye,
    Trash2,
    MapPin,
    Package,
    Tag,
    DollarSign,
    X,
    Grid,
    List,
    Image as ImageIcon,
    Star
} from 'lucide-react';
import { usedItemsApi } from '../api/used-items';
import { UsedItem, ItemCondition } from '../api/types';

const conditionColors: Record<ItemCondition, string> = {
    [ItemCondition.NEW]: 'badge-success',
    [ItemCondition.LIKE_NEW]: 'badge-info',
    [ItemCondition.GOOD]: 'badge-purple',
    [ItemCondition.FAIR]: 'badge-warning',
    [ItemCondition.POOR]: 'badge-error',
};

export default function UsedItemsPage() {
    const [items, setItems] = useState<UsedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<UsedItem | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        city: '',
        itemCategory: '',
        condition: '',
        minPrice: '',
        maxPrice: '',
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await usedItemsApi.getUsedItems();
            setItems(data);
        } catch (error) {
            console.error('Failed to load items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            await usedItemsApi.removeUsedItem(id);
            setItems(items.filter(i => i.id !== id));
            setSelectedItem(null);
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('Failed to delete item');
        }
    };

    const filteredItems = items.filter(item => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!item.brandName?.toLowerCase().includes(query) &&
                !item.itemType?.toLowerCase().includes(query) &&
                !item.description?.toLowerCase().includes(query) &&
                !item.city?.toLowerCase().includes(query)) {
                return false;
            }
        }
        if (filters.city && !item.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
        if (filters.itemCategory && item.itemCategory !== filters.itemCategory) return false;
        if (filters.condition && item.condition !== filters.condition) return false;
        if (filters.minPrice && item.price < parseInt(filters.minPrice)) return false;
        if (filters.maxPrice && item.price > parseInt(filters.maxPrice)) return false;
        return true;
    });

    // Get unique categories
    const categories = [...new Set(items.map(i => i.itemCategory).filter(Boolean))];

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
                    <h1 className="page-title">Used Items</h1>
                    <p className="page-subtitle">Manage marketplace listings</p>
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
                            placeholder="Search items by name, brand, city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={filters.itemCategory}
                            onChange={(e) => setFilters({ ...filters, itemCategory: e.target.value })}
                            className="input w-auto"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            value={filters.condition}
                            onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                            className="input w-auto"
                        >
                            <option value="">All Conditions</option>
                            <option value="New">New</option>
                            <option value="Like new">Like new</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            className="input w-32"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            className="input w-32"
                        />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--primary-400)]">{items.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Total Items</p>
                </div>
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--success-400)]">{categories.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Categories</p>
                </div>
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--accent-400)]">
                        ₹{items.length > 0 ? Math.round(items.reduce((a, b) => a + b.price, 0) / items.length).toLocaleString() : 0}
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)]">Avg. Price</p>
                </div>
                <div className="card-glass p-4">
                    <p className="text-2xl font-bold text-[var(--warning-400)]">{filteredItems.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Filtered Results</p>
                </div>
            </div>

            {/* Items Grid/List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="loading-spinner" />
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Package size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">No items found</h3>
                        <p className="text-[var(--text-secondary)]">Try adjusting your filters</p>
                    </div>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="data-grid">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="card hover:border-[var(--border-accent)] cursor-pointer group"
                        >
                            {/* Image */}
                            <div className="h-48 -mx-6 -mt-6 mb-4 rounded-t-xl bg-[var(--bg-tertiary)] overflow-hidden relative">
                                {item.imageUrls && item.imageUrls.length > 0 ? (
                                    <img
                                        src={item.imageUrls[0]}
                                        alt={item.brandName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <span className={`absolute top-3 left-3 badge ${conditionColors[item.condition] || 'badge-info'}`}>
                                    {item.condition}
                                </span>
                                {item.imageUrls && item.imageUrls.length > 1 && (
                                    <span className="absolute top-3 right-3 badge bg-black/50 text-white">
                                        +{item.imageUrls.length - 1} photos
                                    </span>
                                )}
                            </div>

                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-[var(--text-primary)] truncate">{item.brandName}</h3>
                                    <p className="text-sm text-[var(--text-tertiary)]">{item.itemType}</p>
                                </div>
                            </div>

                            <p className="text-2xl font-bold text-[var(--primary-400)] mb-2">
                                ₹{item.price?.toLocaleString()}
                            </p>

                            <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                                {item.description}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
                                <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                                    <MapPin size={12} />
                                    {item.city}
                                </span>
                                <span className="text-xs text-[var(--text-tertiary)]">{formatTimeAgo(item.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card p-0">
                    <div className="space-y-0">
                        {filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className={`flex items-center gap-4 p-4 hover:bg-[var(--bg-tertiary)] cursor-pointer ${index !== filteredItems.length - 1 ? 'border-b border-[var(--border-primary)]' : ''
                                    }`}
                            >
                                <div className="w-20 h-20 rounded-xl bg-[var(--bg-tertiary)] overflow-hidden flex-shrink-0">
                                    {item.imageUrls && item.imageUrls.length > 0 ? (
                                        <img
                                            src={item.imageUrls[0]}
                                            alt={item.brandName}
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
                                        <h3 className="font-semibold text-[var(--text-primary)]">{item.brandName}</h3>
                                        <span className={`badge ${conditionColors[item.condition] || 'badge-info'}`}>
                                            {item.condition}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--text-tertiary)] mb-1">
                                        {item.itemCategory} • {item.itemType}
                                    </p>
                                    <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-[var(--primary-400)]">
                                        ₹{item.price?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-[var(--text-tertiary)]">{item.city}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
                                    className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[var(--text-tertiary)] hover:text-[var(--error-400)]"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Item Detail Modal */}
            {selectedItem && (
                <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Item Details</h2>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)]"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Image Gallery */}
                            {selectedItem.imageUrls && selectedItem.imageUrls.length > 0 && (
                                <div className="h-64 -mx-6 -mt-6 mb-6 overflow-hidden">
                                    <img
                                        src={selectedItem.imageUrls[0]}
                                        alt={selectedItem.brandName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                                        {selectedItem.brandName}
                                    </h3>
                                    <p className="text-[var(--text-secondary)]">
                                        {selectedItem.itemCategory} • {selectedItem.itemType}
                                    </p>
                                </div>
                                <p className="text-2xl font-bold text-[var(--primary-400)]">
                                    ₹{selectedItem.price?.toLocaleString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <span className={`badge ${conditionColors[selectedItem.condition] || 'badge-info'}`}>
                                    {selectedItem.condition}
                                </span>
                                <span className="badge badge-info flex items-center gap-1">
                                    <MapPin size={12} />
                                    {selectedItem.city}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-[var(--text-tertiary)] mb-2">Description</h4>
                                <p className="text-[var(--text-primary)]">{selectedItem.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-[var(--text-tertiary)]">User ID</p>
                                    <p className="text-[var(--text-primary)] font-mono text-xs">{selectedItem.userId}</p>
                                </div>
                                <div>
                                    <p className="text-[var(--text-tertiary)]">Listed</p>
                                    <p className="text-[var(--text-primary)]">{formatTimeAgo(selectedItem.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setSelectedItem(null)} className="btn btn-secondary">
                                Close
                            </button>
                            <button
                                onClick={() => handleDeleteItem(selectedItem.id)}
                                className="btn btn-danger"
                            >
                                <Trash2 size={16} />
                                Delete Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
