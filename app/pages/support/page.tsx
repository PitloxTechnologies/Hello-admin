"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../../api/admin";
import { SupportTicket, SupportTicketStatus } from "../../api/types";
import { Loader2, AlertCircle, Eye, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function SupportPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const data = await adminApi.getSupportTickets();
            setTickets(data);
        } catch (error) {
            console.error("Failed to load tickets:", error);
            toast.error("Failed to load support tickets");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;

        try {
            await adminApi.deleteSupportTicket(id);
            setTickets(tickets.filter(t => t.id !== id));
            toast.success("Ticket deleted successfully");
        } catch (error) {
            console.error("Failed to delete ticket:", error);
            toast.error("Failed to delete ticket");
        }
    };

    const getStatusBadge = (status: SupportTicketStatus) => {
        switch (status) {
            case SupportTicketStatus.OPEN:
                return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">Open</span>;
            case SupportTicketStatus.IN_PROGRESS:
                return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">In Progress</span>;
            case SupportTicketStatus.RESOLVED:
                return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Resolved</span>;
            case SupportTicketStatus.CLOSED:
                return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">Closed</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded-full">{status}</span>;
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
                <h1 className="text-2xl font-bold text-gray-800">Support Tickets</h1>
                <div className="text-sm text-gray-500">
                    Total Tickets: {tickets.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <AlertCircle className="w-8 h-8 text-gray-300" />
                                            <p>No support tickets found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() => router.push(`/support/${ticket.id}`)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{ticket.subject}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{ticket.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{ticket.userName || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{ticket.userEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 capitalize">
                                                {ticket.category.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(ticket.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(ticket.createdAt || '').toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/support/${ticket.id}`);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(ticket.id, e)}
                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete Ticket"
                                                >
                                                    <XCircle className="w-5 h-5" />
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
        </div>
    );
}
