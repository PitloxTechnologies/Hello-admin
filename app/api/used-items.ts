import { api } from '../config/api';
import { UsedItem, ItemCondition } from './types';

export interface UsedItemFilters {
    city?: string;
    userId?: string;
    itemCategory?: string;
    itemType?: string;
    condition?: ItemCondition;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
}

export const usedItemsApi = {
    /**
     * Get all used items with optional filtering
     */
    getUsedItems: (filters?: UsedItemFilters) =>
        api<UsedItem[]>('/used-items', { params: filters as Record<string, string | number | boolean | undefined> }),

    /**
     * Get a single used item by ID
     */
    getUsedItem: (id: string) =>
        api<UsedItem>(`/used-items/${id}`),

    /**
     * Create a new used item listing
     */
    createUsedItem: (data: Omit<UsedItem, 'id' | 'createdAt' | 'updatedAt'>) =>
        api<UsedItem>('/used-items', { method: 'POST', body: data }),

    /**
     * Update a used item listing
     */
    updateUsedItem: (id: string, data: Partial<UsedItem>) =>
        api<UsedItem>(`/used-items/${id}`, { method: 'PATCH', body: data }),

    /**
     * Delete a used item listing
     */
    removeUsedItem: (id: string) =>
        api<{ message: string }>(`/used-items/${id}`, { method: 'DELETE' }),

    /**
     * Get all used items by user ID
     */
    getItemsByUserId: (userId: string) =>
        api<UsedItem[]>(`/used-items/user/${userId}`),

    /**
     * Search used items by city
     */
    searchByCity: (city: string) =>
        api<UsedItem[]>(`/used-items/search/city/${city}`),

    /**
     * Search used items by category
     */
    searchByCategory: (category: string) =>
        api<UsedItem[]>(`/used-items/search/category/${category}`),
};
