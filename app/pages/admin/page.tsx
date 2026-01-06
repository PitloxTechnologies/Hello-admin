'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/app/components/DataTable';
import { adminApi } from '@/app/api/admin';
import { Admin } from '@/app/api/types';
import { Trash2, Shield, Plus, AlertCircle } from 'lucide-react';

export default function AdminsPage() {
    const router = useRouter();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAdmins();
            setAdmins(data);
            setError('');
        } catch (err: any) {
            console.error('Failed to fetch admins:', err);
            setError('Failed to load admins. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this admin?')) return;

        try {
            await adminApi.deleteAdmin(id);
            setAdmins(admins.filter((admin) => admin.id !== id));
        } catch (err: any) {
            alert('Failed to delete admin: ' + (err.message || 'Unknown error'));
        }
    };

    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        {
            key: 'createdAt',
            label: 'Created At',
            sortable: true,
            render: (admin: Admin) => new Date(admin.createdAt!).toLocaleDateString(),
        },
        {
            key: 'lastLoginAt',
            label: 'Last Login',
            sortable: true,
            render: (admin: Admin) =>
                admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'Never',
        },
    ];

    const actions = (admin: Admin) => (
        <div className="flex justify-end gap-2">
            <button
                className="p-2 hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 rounded-lg transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(admin.id);
                }}
                title="Delete Admin"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[var(--primary-500)]/10 text-[var(--primary-400)]">
                            <Shield size={24} />
                        </div>
                        Admin Management
                    </h1>
                    <p className="page-subtitle ml-[52px]">Manage system administrators</p>
                </div>
                <button
                    onClick={() => router.push('/pages/Auth/signup')}
                    className="btn btn-primary"
                >
                    <Plus size={18} />
                    Add New Admin
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            <div className="card p-6">
                <DataTable
                    columns={columns}
                    data={admins}
                    loading={loading}
                    actions={actions}
                    searchPlaceholder="Search admins..."
                    emptyMessage="No admins found"
                    rowId="id"
                />
            </div>
        </div>
    );
}
