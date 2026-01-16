"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../../api/admin";
import { Report, ReportStatus, ReportType } from "../../api/types";
import { Loader2, AlertCircle, Eye, CheckCircle, XCircle, Flag } from "lucide-react";
import toast from "react-hot-toast";

export default function ReportsPage() {
    const router = useRouter();
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const data = await adminApi.getReports();
            setReports(data);
        } catch (error) {
            console.error("Failed to load reports:", error);
            toast.error("Failed to load reports");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this report?")) return;

        try {
            await adminApi.deleteReport(id);
            setReports(reports.filter(r => r.id !== id));
            toast.success("Report deleted successfully");
        } catch (error) {
            console.error("Failed to delete report:", error);
            toast.error("Failed to delete report");
        }
    };

    const getStatusBadge = (status: ReportStatus) => {
        switch (status) {
            case ReportStatus.PENDING:
                return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
            case ReportStatus.REVIEWED:
                return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">Reviewed</span>;
            case ReportStatus.ACTION_TAKEN:
                return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Action Taken</span>;
            case ReportStatus.DISMISSED:
                return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">Dismissed</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded-full">{status}</span>;
        }
    };

    const getTypeBadge = (type: ReportType) => {
        switch (type) {
            case ReportType.USER:
                return <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-md">User</span>;
            case ReportType.ROOM:
                return <span className="px-2 py-1 text-xs font-semibold text-teal-800 bg-teal-100 rounded-md">Room</span>;
            case ReportType.ITEM:
                return <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-md">Item</span>;
            case ReportType.MESSAGE:
                return <span className="px-2 py-1 text-xs font-semibold text-pink-800 bg-pink-100 rounded-md">Message</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded-md">{type}</span>;
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
                <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
                <div className="text-sm text-gray-500">
                    Total Reports: {reports.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Target</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Reporter</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Flag className="w-8 h-8 text-gray-300" />
                                            <p>No reports found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr
                                        key={report.id}
                                        onClick={() => router.push(`/reports/${report.id}`)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 capitalize">
                                                {report.reason.replace(/([A-Z])/g, ' $1').trim()}
                                            </div>
                                            {report.description && (
                                                <div className="text-xs text-gray-500 truncate max-w-[150px]">{report.description}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getTypeBadge(report.type)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{report.targetName || 'Unknown'}</div>
                                            <div className="text-xs font-mono text-gray-500 truncate max-w-[100px]">{report.targetId}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{report.reporterName || 'Unknown'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(report.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(report.createdAt || '').toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/reports/${report.id}`);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(report.id, e)}
                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete Report"
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
