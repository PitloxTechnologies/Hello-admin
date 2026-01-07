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
    Star,
    ShoppingBag
} from 'lucide-react';
import { usedItemsApi } from '../../api/used-items';
import { UsedItem, ItemCondition } from '../../api/types';

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
            <div className="card mb-8 p-4 bg-[var(--bg-secondary)]/50 backdrop-blur-sm">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--primary-400)] mb-1">{items.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Total Items</p>
                </div>
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--success-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--success-400)] mb-1">{categories.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Categories</p>
                </div>
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--accent-400)] mb-1">
                        ₹{items.length > 0 ? Math.round(items.reduce((a, b) => a + b.price, 0) / items.length).toLocaleString() : 0}
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Avg. Price</p>
                </div>
                <div className="card-glass p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--warning-500)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-3xl font-bold text-[var(--warning-400)] mb-1">{filteredItems.length}</p>
                    <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Filtered Results</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="card group cursor-pointer hover:shadow-xl hover:shadow-[var(--primary-500)]/10 hover:border-[var(--primary-500)]/30"
                        >
                            {/* Image */}
                            <div className="h-56 rounded-t-xl bg-[var(--bg-tertiary)] overflow-hidden relative">
                                {item.imageUrls && item.imageUrls.length > 0 ? (
                                    <img
                                        src={item.imageUrls[0]}
                                        alt={item.brandName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)] bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]">
                                        <ImageIcon size={48} className="opacity-50" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className={`badge ${conditionColors[item.condition] || 'badge-info'} shadow-lg backdrop-blur-md`}>
                                        {item.condition}
                                    </span>
                                </div>
                                {item.imageUrls && item.imageUrls.length > 1 && (
                                    <span className="absolute top-3 right-3 badge bg-black/50 text-white backdrop-blur-md border-0">
                                        +{item.imageUrls.length - 1} photos
                                    </span>
                                )}
                                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />
                            </div>

                            <div className="p-4 relative">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0 pr-3">
                                        <h3 className="font-semibold text-[var(--text-primary)] truncate text-lg">{item.brandName}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] truncate">{item.itemType}</p>
                                    </div>
                                    <p className="text-lg font-bold text-[var(--primary-400)] whitespace-nowrap">
                                        ₹{item.price?.toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs font-medium text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-md">
                                        {item.itemCategory}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-primary)]">
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <MapPin size={14} className="text-[var(--primary-400)]" />
                                        {item.city}
                                    </span>
                                    <span className="text-xs text-[var(--text-tertiary)]">{formatTimeAgo(item.createdAt)}</span>
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
                                <th>Item</th>
                                <th>Category</th>
                                <th>Condition</th>
                                <th>Price</th>
                                <th>Location</th>
                                <th>Posted</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className="cursor-pointer group"
                                >
                                    <td>
                                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden">
                                            {item.imageUrls && item.imageUrls.length > 0 ? (
                                                <img
                                                    src={item.imageUrls[0]}
                                                    alt={item.brandName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-[var(--text-primary)]">{item.brandName}</span>
                                            <span className="text-xs text-[var(--text-tertiary)]">{item.itemType}</span>
                                        </div>
                                    </td>
                                    <td className="text-[var(--text-secondary)]">{item.itemCategory}</td>
                                    <td>
                                        <span className={`badge ${conditionColors[item.condition] || 'badge-info'}`}>
                                            {item.condition}
                                        </span>
                                    </td>
                                    <td className="font-medium text-[var(--primary-400)]">
                                        ₹{item.price?.toLocaleString()}
                                    </td>
                                    <td className="text-[var(--text-secondary)]">{item.city}</td>
                                    <td className="text-[var(--text-tertiary)] text-xs">{formatTimeAgo(item.createdAt)}</td>
                                    <td>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
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

            {/* Item Detail Modal */}
            {selectedItem && (
                <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="modal max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Item Details</h2>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden lg:grid lg:grid-cols-2">
                            {/* Left: Images */}
                            <div className="bg-black/20 p-6 flex items-center justify-center overflow-auto h-64 lg:h-auto border-b lg:border-b-0 lg:border-r border-[var(--border-primary)]">
                                {selectedItem.imageUrls && selectedItem.imageUrls.length > 0 ? (
                                    <img
                                        src={selectedItem.imageUrls[0]}
                                        alt={selectedItem.brandName}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-[var(--text-tertiary)]">
                                        <ImageIcon size={64} className="mb-4 opacity-50" />
                                        <p>No images available</p>
                                    </div>
                                )}
                            </div>

                            {/* Right: Info */}
                            <div className="p-8 overflow-y-auto">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                                            {selectedItem.brandName}
                                        </h3>
                                        <p className="text-[var(--text-secondary)]">
                                            {selectedItem.itemCategory} • {selectedItem.itemType}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-[var(--primary-400)]">
                                            ₹{selectedItem.price?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mb-8">
                                    <span className={`badge px-3 py-1 text-sm ${conditionColors[selectedItem.condition] || 'badge-info'}`}>
                                        {selectedItem.condition}
                                    </span>
                                    <span className="badge badge-info px-3 py-1 text-sm flex items-center gap-1">
                                        <MapPin size={14} />
                                        {selectedItem.city}
                                    </span>
                                    <span className="badge bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-primary)] px-3 py-1 text-sm">
                                        {formatTimeAgo(selectedItem.createdAt)}
                                    </span>
                                </div>

                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Description</h4>
                                    <p className="text-[var(--text-primary)] leading-relaxed text-lg bg-[var(--bg-tertiary)]/30 p-4 rounded-xl border border-[var(--border-primary)]">
                                        {selectedItem.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)]/10">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-1">User ID</p>
                                        <p className="text-[var(--text-primary)] font-mono text-sm truncate" title={selectedItem.userId}>{selectedItem.userId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-1">Listed On</p>
                                        <p className="text-[var(--text-primary)] text-sm">
                                            {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={() => handleDeleteItem(selectedItem.id)}
                                className="btn btn-danger"
                            >
                                <Trash2 size={18} />
                                Delete Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
