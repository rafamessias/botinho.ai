'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function PWATestPage() {
    const [pwaInfo, setPwaInfo] = useState<any>({});
    const [manifestInfo, setManifestInfo] = useState<any>({});

    useEffect(() => {
        const checkPWA = async () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isIOS = /iphone|ipad|ipod/.test(userAgent);
            const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
            const isChrome = /chrome/.test(userAgent);
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isInApp = (window.navigator as any).standalone === true;

            setPwaInfo({
                userAgent: userAgent,
                isIOS,
                isSafari,
                isChrome,
                isStandalone,
                isInApp,
                isPWAInstalled: isStandalone || isInApp,
                supportsBeforeInstallPrompt: 'onbeforeinstallprompt' in window,
                supportsServiceWorker: 'serviceWorker' in navigator,
                isOnline: navigator.onLine,
            });

            // Check manifest
            try {
                const response = await fetch('/site.webmanifest');
                const manifest = await response.json();
                setManifestInfo(manifest);
            } catch (error) {
                console.error('Failed to load manifest:', error);
            }
        };

        checkPWA();
    }, []);

    const getStatusIcon = (condition: boolean) => {
        return condition ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
            <XCircle className="h-4 w-4 text-red-500" />
        );
    };

    const getInstallInstructions = () => {
        if (pwaInfo.isIOS) {
            return (
                <div className="space-y-2">
                    <h3 className="font-semibold">iOS Installation Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Open Safari (not Chrome)</li>
                        <li>Tap the Share button (square with arrow)</li>
                        <li>Scroll down and tap "Add to Home Screen"</li>
                        <li>Tap "Add" to confirm</li>
                    </ol>
                </div>
            );
        } else if (pwaInfo.isChrome) {
            return (
                <div className="space-y-2">
                    <h3 className="font-semibold">Chrome Installation Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Look for the install prompt in the address bar</li>
                        <li>Or click the three dots menu → "Install app"</li>
                    </ol>
                </div>
            );
        }
        return <p className="text-sm text-muted-foreground">Installation method depends on your browser</p>;
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">PWA Test Page</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Device & Browser Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Badge variant={pwaInfo.isIOS ? "default" : "secondary"}>
                                {pwaInfo.isIOS ? "iOS Device" : "Not iOS"}
                            </Badge>
                        </div>
                        <div>
                            <Badge variant={pwaInfo.isSafari ? "default" : "secondary"}>
                                {pwaInfo.isSafari ? "Safari" : pwaInfo.isChrome ? "Chrome" : "Other Browser"}
                            </Badge>
                        </div>
                        <div>
                            <Badge variant={pwaInfo.isPWAInstalled ? "default" : "secondary"}>
                                {pwaInfo.isPWAInstalled ? "PWA Installed" : "Not PWA"}
                            </Badge>
                        </div>
                        <div>
                            <Badge variant={pwaInfo.isOnline ? "default" : "destructive"}>
                                {pwaInfo.isOnline ? "Online" : "Offline"}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">PWA Support:</h3>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(pwaInfo.supportsBeforeInstallPrompt)}
                                <span>Install Prompt Support</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(pwaInfo.supportsServiceWorker)}
                                <span>Service Worker Support</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Installation Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    {getInstallInstructions()}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Manifest Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(manifestInfo, null, 2)}
                    </pre>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Debug Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(pwaInfo, null, 2)}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
} 