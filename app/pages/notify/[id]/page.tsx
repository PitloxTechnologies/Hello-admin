"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "../../../api/admin";
import { Notify, UpdateNotifyDto } from "../../../api/types";
import { Loader2, ArrowLeft, Save, Trash2, Bell } from "lucide-react";
import toast from "react-hot-toast";

export default function NotifyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [notify, setNotify] = useState<Notify | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<UpdateNotifyDto>({
        title: "",
        description: "",
    });

    useEffect(() => {
        if (params.id) {
            loadNotify(params.id as string);
        }
    }, [params.id]);

    const loadNotify = async (id: string) => {
        try {
            const data = await adminApi.getNotification(id);
            setNotify(data);
            setFormData({
                title: data.title,
                description: data.description || "",
            });
        } catch (error) {
            console.error("Failed to load notification:", error);
            toast.error("Failed to load notification details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!notify) return;
        if (!formData.title?.trim()) {
            toast.error("Title is required");
            return;
        }

        setIsSaving(true);
        try {
            await adminApi.updateNotification(notify.id, formData);
            toast.success("Notification updated successfully");
            loadNotify(notify.id);
        } catch (error) {
            console.error("Failed to update notification:", error);
            toast.error("Failed to update notification");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!notify) return;
        if (!window.confirm("Are you sure you want to delete this notification?")) return;

        try {
            await adminApi.deleteNotification(notify.id);
            toast.success("Notification deleted successfully");
            router.push("/pages/notify");
        } catch (error) {
            console.error("Failed to delete notification:", error);
            toast.error("Failed to delete notification");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!notify) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800">Notification not found</h2>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notifications
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Bell className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Notification</h1>
                            <p className="text-sm text-gray-500">
                                Created on {new Date(notify.createdAt || "").toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Notification"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter notification title"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            maxLength={200}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter notification description (optional)"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-32"
                            maxLength={1000}
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Notification ID</h3>
                <code className="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                    {notify.id}
                </code>
            </div>
        </div>
    );
}
