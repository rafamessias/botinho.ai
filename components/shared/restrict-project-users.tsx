'use client';

import { useUser } from '@/components/getUser';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface RestrictProjectUsersProps {
    children: React.ReactNode;
    redirectTo?: string;
    showToast?: boolean;
}

export function RestrictProjectUsers({
    children,
    redirectTo = '/',
    showToast = true
}: RestrictProjectUsersProps) {
    const { user } = useUser();
    const router = useRouter();
    const toastShownRef = useRef(false);

    useEffect(() => {
        if (user?.type === 'projectUser' && !toastShownRef.current) {
            if (showToast) {
                toast.error('Access denied. Project users cannot access this page.');
                toastShownRef.current = true;
            }
            router.push(redirectTo);
        }
    }, [user, router, redirectTo, showToast]);

    // If user is a project user, don't render children
    if (user?.type === 'projectUser') {
        return null;
    }

    return <>{children}</>;
} 