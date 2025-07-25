'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Globe, Info } from 'lucide-react';

export default function PWAStatus() {
    const [isPWA, setIsPWA] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [pwaInfo, setPwaInfo] = useState<any>({});

    useEffect(() => {
        // Check if running as PWA
        const checkPWA = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isInApp = (window.navigator as any).standalone === true;
            const isPWAInstalled = isStandalone || isInApp;
            setIsPWA(isPWAInstalled);

            // Collect PWA debugging info
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isIOS = /iphone|ipad|ipod/.test(userAgent);
            const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
            const isChrome = /chrome/.test(userAgent);

            setPwaInfo({
                userAgent: userAgent,
                isIOS,
                isSafari,
                isChrome,
                isStandalone,
                isInApp,
                isPWAInstalled,
                supportsBeforeInstallPrompt: 'onbeforeinstallprompt' in window,
                supportsServiceWorker: 'serviceWorker' in navigator,
            });

            console.log('PWA Status Debug:', {
                userAgent: userAgent,
                isIOS,
                isSafari,
                isChrome,
                isStandalone,
                isInApp,
                isPWAInstalled,
                supportsBeforeInstallPrompt: 'onbeforeinstallprompt' in window,
                supportsServiceWorker: 'serviceWorker' in navigator,
            });
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

    // Show debug info in development
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!isPWA && !isDevelopment) return null;

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
                {isDevelopment && (
                    <div className="ml-2 text-xs text-muted-foreground">
                        <div>iOS: {pwaInfo.isIOS ? 'Yes' : 'No'}</div>
                        <div>Safari: {pwaInfo.isSafari ? 'Yes' : 'No'}</div>
                        <div>Chrome: {pwaInfo.isChrome ? 'Yes' : 'No'}</div>
                        <div>Install Prompt: {pwaInfo.supportsBeforeInstallPrompt ? 'Yes' : 'No'}</div>
                    </div>
                )}
            </div>
        </div>
    );
} 