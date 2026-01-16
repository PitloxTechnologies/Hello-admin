"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "../../../api/admin";
import { Report, ReportStatus, ReportType } from "../../../api/types";
import { Loader2, ArrowLeft, Send, ExternalLink, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function ReportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [adminNotes, setAdminNotes] = useState("");
    const [status, setStatus] = useState<ReportStatus>(ReportStatus.PENDING);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadReport(params.id as string);
        }
    }, [params.id]);

    const loadReport = async (id: string) => {
        try {
            const data = await adminApi.getReport(id);
            setReport(data);
            setStatus(data.status);
            if (data.adminNotes) setAdminNotes(data.adminNotes);
        } catch (error) {
            console.error("Failed to load report:", error);
            toast.error("Failed to load report details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!report) return;

        setIsSaving(true);
        try {
            await adminApi.updateReport(report.id, {
                status: status,
                adminNotes: adminNotes
            });
            toast.success("Report updated successfully");
            loadReport(report.id);
        } catch (error) {
            console.error("Failed to update report:", error);
            toast.error("Failed to update report");
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

    if (!report) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800">Report not found</h2>
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
                Back to Reports
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                                    {report.reason.replace(/([A-Z])/g, ' $1').trim()}
                                </h1>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>Created on {new Date(report.createdAt || '').toLocaleString()}</span>
                                    <span>•</span>
                                    <span className="capitalize">{report.type} Report</span>
                                </div>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${status === ReportStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                status === ReportStatus.REVIEWED ? 'bg-blue-100 text-blue-800' :
                                    status === ReportStatus.ACTION_TAKEN ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {status.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                        </div>

                        <div className="prose max-w-none text-gray-700">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                            <p className="bg-gray-50 p-4 rounded-lg">{report.description || 'No description provided.'}</p>
                        </div>

                        {report.screenshotUrls && report.screenshotUrls.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Proof / Screenshots</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {report.screenshotUrls.map((url: string, index: number) => (
                                        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="block relative group">
                                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={url}
                                                    alt={`Screenshot ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                <ExternalLink className="w-6 h-6 text-white" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Admin Action Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Action</h2>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Internal notes about this report..."
                            className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-3">
                                <label className="text-sm font-medium text-gray-700">Update Status:</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as ReportStatus)}
                                    className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                >
                                    {Object.values(ReportStatus).map((s) => (
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
                    {/* Reporter Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Reporter Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 block">Name</label>
                                <div className="font-medium text-gray-900">{report.reporterName || 'Unknown'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block">User ID</label>
                                <div className="text-xs font-mono text-gray-600 bg-gray-50 p-1 rounded mt-1">{report.reporterId}</div>
                            </div>
                        </div>
                    </div>

                    {/* Target Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Target Information</h3>
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 block">Target Type</label>
                                <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 capitalize mt-1">
                                    {report.type}
                                </span>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block">Target Name</label>
                                <div className="font-medium text-gray-900">{report.targetName || 'Unknown'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block">Target ID</label>
                                <div className="text-xs font-mono text-gray-600 bg-gray-50 p-1 rounded mt-1">{report.targetId}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
