'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Globe } from 'lucide-react';

export default function PWAStatus() {
    const [isPWA, setIsPWA] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Check if running as PWA
        const checkPWA = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isInApp = (window.navigator as any).standalone === true;
            setIsPWA(isStandalone || isInApp);
        };

        // Check online status
        const checkOnline = () => {
            setIsOnline(navigator.onLine);
        };

        checkPWA();
        checkOnline();

        window.addEventListener('online', checkOnline);
        window.addEventListener('offline', checkOnline);

        return () => {
            window.removeEventListener('online', checkOnline);
            window.removeEventListener('offline', checkOnline);
        };
    }, []);

    if (!isPWA) return null;

    return (
        <div className="fixed top-4 right-4 z-40 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs">
            <div className="flex items-center space-x-2">
                <Smartphone className="h-3 w-3 text-primary" />
                <span className="text-muted-foreground">PWA</span>
                {!isOnline && (
                    <>
                        <Globe className="h-3 w-3 text-orange-500" />
                        <span className="text-orange-500">Offline</span>
                    </>
                )}
            </div>
        </div>
    );
} 