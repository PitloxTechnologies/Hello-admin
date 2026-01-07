'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { adminApi } from '../api/admin';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isAuthPage = pathname?.startsWith('/pages/Auth');

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthPage) {
                setIsLoading(false);
                return;
            }

            try {
                await adminApi.getProfile();
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
                router.push('/pages/Auth/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, isAuthPage, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Sidebar />
            <main className="lg:ml-[280px] min-h-screen p-6 transition-[margin] duration-300">
                <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-3rem)] flex flex-col">
                    <div className="flex-1">
                        {children}
                    </div>
                    <Footer />
                </div>
            </main>
        </>
    );
}
