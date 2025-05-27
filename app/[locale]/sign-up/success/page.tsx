'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from '@/components/logo';
import { useRouter } from '@/i18n/navigation';

export default function EmailVerificationSuccessPage() {
    const [countdown, setCountdown] = useState(10);
    const router = useRouter();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            router.push('/sign-in');
        }
    }, [countdown, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md py-12 px-6 grid gap-6">
                <CardHeader className="space-y-1 flex flex-col items-center gap-5">
                    <Logo className="h-15 w-15 text-blue-700" />
                    <CardTitle className="text-2xl font-bold text-center">
                        Email Verified Successfully!
                    </CardTitle>
                    <CardDescription className="text-center">
                        Your email has been verified. You will be redirected to the login page in {countdown} seconds.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            If you are not redirected automatically,{' '}
                            <button
                                onClick={() => router.push('/sign-in')}
                                className="text-blue-700 hover:underline"
                            >
                                click here
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 