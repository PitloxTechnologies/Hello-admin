"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "../../../api/admin";
import { SupportTicket, SupportTicketStatus } from "../../../api/types";
import { Loader2, ArrowLeft, Send, Paperclip, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function SupportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [response, setResponse] = useState("");
    const [status, setStatus] = useState<SupportTicketStatus>(SupportTicketStatus.OPEN);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadTicket(params.id as string);
        }
    }, [params.id]);

    const loadTicket = async (id: string) => {
        try {
            const data = await adminApi.getSupportTicket(id);
            setTicket(data);
            setStatus(data.status);
            if (data.adminResponse) setResponse(data.adminResponse);
        } catch (error) {
            console.error("Failed to load ticket:", error);
            toast.error("Failed to load ticket details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!ticket) return;

        setIsSaving(true);
        try {
            await adminApi.updateSupportTicket(ticket.id, {
                status: status,
                adminResponse: response
            });
            toast.success("Ticket updated successfully");
            loadTicket(ticket.id);
        } catch (error) {
            console.error("Failed to update ticket:", error);
            toast.error("Failed to update ticket");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800">Ticket not found</h2>
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
        <div className="p-6 max-w-5xl mx-auto">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tickets
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.subject}</h1>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>Created on {new Date(ticket.createdAt || '').toLocaleString()}</span>
                                    <span>•</span>
                                    <span className="capitalize">{ticket.category.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </div>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${status === SupportTicketStatus.OPEN ? 'bg-blue-100 text-blue-800' :
                                status === SupportTicketStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' :
                                    status === SupportTicketStatus.RESOLVED ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {status.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                        </div>

                        <div className="prose max-w-none text-gray-700">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                            <p className="bg-gray-50 p-4 rounded-lg">{ticket.description}</p>
                        </div>

                        {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Attachments</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {ticket.attachmentUrls.map((url: string, index: number) => (
                                        <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600 truncate flex-1">Attachment {index + 1}</span>
                                            <Download className="w-4 h-4 text-gray-400" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Admin Response Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Response</h2>
                        <textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Write your response here..."
                            className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-3">
                                <label className="text-sm font-medium text-gray-700">Update Status:</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as SupportTicketStatus)}
                                    className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                >
                                    {Object.values(SupportTicketStatus).map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">User Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 block">Full Name</label>
                                <div className="font-medium text-gray-900">{ticket.userName || 'Unknown'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block">Email</label>
                                <div className="font-medium text-gray-900 break-all">{ticket.userEmail}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block">User ID</label>
                                <div className="text-xs font-mono text-gray-600 bg-gray-50 p-1 rounded mt-1">{ticket.userId}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
