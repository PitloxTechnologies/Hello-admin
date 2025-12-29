'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchable?: boolean;
    searchPlaceholder?: string;
    onRowClick?: (item: T) => void;
    actions?: (item: T) => React.ReactNode;
    emptyMessage?: string;
    loading?: boolean;
    pageSize?: number;
    rowId?: keyof T; // Allow specifying the unique ID field
}

export default function DataTable<T>({
    columns,
    data,
    searchable = true,
    searchPlaceholder = 'Search...',
    onRowClick,
    actions,
    emptyMessage = 'No data found',
    loading = false,
    pageSize = 10,
    rowId,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    // Filter data based on search
    const filteredData = data.filter((item) => {
        if (!searchQuery) return true;
        return Object.values(item as Record<string, unknown>).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = (a as Record<string, unknown>)[sortConfig.key];
        const bValue = (b as Record<string, unknown>)[sortConfig.key];

        if (aValue === bValue) return 0;

        // Handle specific types if needed, else string conversion
        const aStr = String(aValue);
        const bStr = String(bValue);

        const comparison = aStr < bStr ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    // Paginate data
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSort = (key: string) => {
        setSortConfig((current) => {
            if (current?.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const getValue = (item: T, key: string): unknown => {
        const keys = key.split('.');
        let value: unknown = item;
        for (const k of keys) {
            value = (value as Record<string, unknown>)?.[k];
        }
        return value;
    };

    const getRowKey = (item: T, index: number): string | number => {
        if (rowId) return String((item as any)[rowId]);
        if ('id' in (item as any)) return String((item as any).id);
        if ('uid' in (item as any)) return String((item as any).uid);
        if ('_id' in (item as any)) return String((item as any)._id);
        return index;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="loading-spinner w-8 h-8 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            {searchable && (
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={18} />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="input pl-11 focus:ring-2 focus:ring-[var(--primary-500)]/20"
                    />
                </div>
            )}

            {/* Table */}
            <div className="table-container bg-[var(--bg-secondary)] shadow-sm">
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    onClick={() => column.sortable && handleSort(String(column.key))}
                                    className={column.sortable ? 'cursor-pointer hover:text-[var(--primary-400)] transition-colors' : ''}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {sortConfig?.key === String(column.key) && (
                                            <span className="text-[var(--primary-500)] font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="w-16 text-right pr-6">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-16">
                                    <div className="flex flex-col items-center justify-center text-[var(--text-tertiary)]">
                                        <Search size={32} className="mb-2 opacity-20" />
                                        <p>{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, index) => (
                                <tr
                                    key={getRowKey(item, index)}
                                    onClick={() => onRowClick?.(item)}
                                    className={`border-b border-[var(--border-primary)] last:border-0 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[var(--bg-tertiary)]/50' : ''}`}
                                >
                                    {columns.map((column) => (
                                        <td key={String(column.key)}>
                                            {column.render
                                                ? column.render(item)
                                                : String(getValue(item, String(column.key)) ?? '-')}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                                            {actions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-[var(--text-tertiary)]">
                        Showing <span className="font-medium text-[var(--text-primary)]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                        <span className="font-medium text-[var(--text-primary)]">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
                        <span className="font-medium text-[var(--text-primary)]">{sortedData.length}</span> results
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum = i + 1;
                                if (totalPages > 5) {
                                    if (currentPage > 3) {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    if (pageNum > totalPages) {
                                        pageNum = totalPages - 4 + i;
                                    }
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`
                      w-8 h-8 rounded-lg text-sm font-medium transition-all
                      ${pageNum === currentPage
                                                ? 'bg-[var(--primary-500)] text-white shadow-md shadow-indigo-500/20'
                                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                                            }
                    `}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
