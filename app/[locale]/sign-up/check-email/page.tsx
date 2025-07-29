'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from '@/components/logo';
import { toast } from "sonner";
import { sendEmailConfirmationAction } from '@/components/actions/send-email-confirmation';
import { useUser } from '@/components/UserProvider';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

const initialCountdown = 60;

export default function SignUpCheckEmailPage() {
    const t = useTranslations('auth');
    const [countdown, setCountdown] = useState(initialCountdown);
    const [isResending, setIsResending] = useState(false);
    const { user } = useUser();
    // Get email param from URL using Next.js features

    const searchParams = typeof window !== 'undefined' ? useSearchParams() : null;
    const emailFromUrl = searchParams ? searchParams.get('email') : null;


    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResendEmail = async () => {
        if (!user?.email && !emailFromUrl) return;

        setIsResending(true);
        try {
            const result = await sendEmailConfirmationAction(user?.email || emailFromUrl);
            console.log("result", result);
            if (result.success) {
                toast.success(result.message);
                setCountdown(initialCountdown);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to resend verification email.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-[calc(100vh-65px)] py-12 md:py-0">
            <Card className="w-full max-w-md py-12 px-6 grid gap-6">
                <CardHeader className="space-y-1 flex flex-col items-center gap-5">
                    <Logo className="h-15 w-15 text-blue-700" />
                    <CardTitle className="text-2xl font-bold text-center">
                        {t('checkEmail.title')}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t('checkEmail.description', { email: user?.email })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                            {t('checkEmail.noEmail')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {t('checkEmail.requestAnother')}
                        </p>
                        <p className="text-2xl font-bold text-blue-700 mt-2">
                            {countdown} {t('checkEmail.seconds')}
                        </p>
                    </div>
                    <Button
                        onClick={handleResendEmail}
                        disabled={countdown > 0 || isResending}
                        className="w-full"
                    >
                        {isResending ? t('checkEmail.sending') : t('checkEmail.resend')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
} 