"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../../api/admin";
import { Notify, CreateNotifyDto } from "../../api/types";
import { Loader2, Plus, Eye, Trash2, Bell, X } from "lucide-react";
import toast from "react-hot-toast";

export default function NotifyPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notify[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newNotify, setNewNotify] = useState<CreateNotifyDto>({
        title: "",
        description: "",
    });

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await adminApi.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to load notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNotify.title.trim()) {
            toast.error("Title is required");
            return;
        }

        setIsCreating(true);
        try {
            await adminApi.createNotification(newNotify);
            toast.success("Notification created successfully");
            setShowCreateModal(false);
            setNewNotify({ title: "", description: "" });
            loadNotifications();
        } catch (error) {
            console.error("Failed to create notification:", error);
            toast.error("Failed to create notification");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this notification?")) return;

        try {
            await adminApi.deleteNotification(id);
            setNotifications(notifications.filter(n => n.id !== id));
            toast.success("Notification deleted successfully");
        } catch (error) {
            console.error("Failed to delete notification:", error);
            toast.error("Failed to delete notification");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Notification
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Created At</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {notifications.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Bell className="w-8 h-8 text-gray-300" />
                                            <p>No notifications found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                notifications.map((notify) => (
                                    <tr
                                        key={notify.id}
                                        onClick={() => router.push(`/pages/notify/${notify.id}`)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{notify.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 truncate max-w-[300px]">
                                                {notify.description || "No description"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(notify.createdAt || "").toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/pages/notify/${notify.id}`);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(notify.id, e)}
                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete Notification"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Create Notification</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newNotify.title}
                                    onChange={(e) => setNewNotify({ ...newNotify, title: e.target.value })}
                                    placeholder="Enter notification title"
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    maxLength={200}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={newNotify.description}
                                    onChange={(e) => setNewNotify({ ...newNotify, description: e.target.value })}
                                    placeholder="Enter notification description (optional)"
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24"
                                    maxLength={1000}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                >
                                    {isCreating ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Plus className="w-4 h-4 mr-2" />
                                    )}
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
