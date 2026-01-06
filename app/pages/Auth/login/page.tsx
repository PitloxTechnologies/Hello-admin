'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/app/api/admin';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await adminApi.login(formData);
            // Redirect to dashboard after successful login
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[var(--bg-primary)]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary-500)]/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-500)]/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
                        <img src="/Logo.png" alt="Hello Roomie" className="w-10 h-10 object-cover" />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Welcome Back</h1>
                    <p className="text-[var(--text-secondary)]">Sign in to access your admin dashboard</p>
                </div>

                <div className="card p-8 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-primary)] shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    className="input pl-11"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    className="input pl-11"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full btn btn-primary py-3 transform transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <p className="text-sm text-[var(--text-secondary)]">
                                Don't have an account?{' '}
                                <Link
                                    href="/pages/Auth/signup"
                                    className="font-medium text-[var(--primary-400)] hover:text-[var(--primary-300)] transition-colors"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
