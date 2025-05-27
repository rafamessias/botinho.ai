'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from '@/components/logo';
import { toast } from "sonner";
import { sendEmailConfirmationAction } from '@/components/actions/send-email-confirmation';
import { useUser } from '@/components/UserProvider';

export default function SignUpCheckEmailPage() {
    const [countdown, setCountdown] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResendEmail = async () => {
        if (!user?.email) return;

        setIsResending(true);
        try {
            const result = await sendEmailConfirmationAction(user.email);
            if (result.success) {
                toast.success(result.message);
                setCountdown(60);
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
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md py-12 px-6 grid gap-6">
                <CardHeader className="space-y-1 flex flex-col items-center gap-5">
                    <Logo className="h-15 w-15 text-blue-700" />
                    <CardTitle className="text-2xl font-bold text-center">
                        Check Your Email
                    </CardTitle>
                    <CardDescription className="text-center">
                        We've sent a verification email to {user?.email}. Please check your inbox and follow the instructions to verify your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                            Didn't receive the email?
                        </p>
                        <p className="text-sm text-muted-foreground">
                            You can request another verification email in:
                        </p>
                        <p className="text-2xl font-bold text-blue-700 mt-2">
                            {countdown} seconds
                        </p>
                    </div>
                    <Button
                        onClick={handleResendEmail}
                        disabled={countdown > 0 || isResending}
                        className="w-full"
                    >
                        {isResending ? "Sending..." : "Resend Verification Email"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
} 