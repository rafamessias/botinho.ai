'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import NProgress from 'nprogress';

export function TopProgress() {
    const path = usePathname();
    NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

    useEffect(() => {
        NProgress.start();
        return () => {
            NProgress.done();
            NProgress.remove();
        };
    }, [path]);
    return null;
}
