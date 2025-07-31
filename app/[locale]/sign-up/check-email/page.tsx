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
import { useRouter } from '@/i18n/navigation';


const initialCountdown = 60;

export default function SignUpCheckEmailPage() {
    const t = useTranslations('auth');
    const [countdown, setCountdown] = useState(initialCountdown);
    const [isResending, setIsResending] = useState(false);
    const [isValidatingToken, setIsValidatingToken] = useState(false);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const { user } = useUser();
    const router = useRouter();
    const searchParams = typeof window !== 'undefined' ? useSearchParams() : null;
    const emailFromUrl = searchParams ? searchParams.get('email') : null;
    const tokenFromUrl = searchParams ? searchParams.get('token') : null;

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => {
        if (tokenFromUrl) {
            const confirmEmail = async () => {
                setIsValidatingToken(true);
                setTokenError(null);

                try {
                    const result = await sendEmailConfirmationAction(user?.email || emailFromUrl, tokenFromUrl);

                    if (result.success) {
                        toast.success(result.message);
                        router.push('/sign-up/success');
                    } else {
                        setTokenError(result.error || 'Invalid token');
                        toast.error(result.error);
                        // Reset countdown to allow immediate resend when token is invalid
                        setCountdown(0);
                    }
                } catch (error) {
                    const errorMessage = t('checkEmail.error');
                    setTokenError(errorMessage);
                    toast.error(errorMessage);
                    setCountdown(0);
                } finally {
                    setIsValidatingToken(false);
                }
            }
            confirmEmail();
        }
    }, [emailFromUrl, tokenFromUrl, user?.email]);

    const handleResendEmail = async () => {
        if (!user?.email && !emailFromUrl) return;

        setIsResending(true);
        setTokenError(null); // Clear any previous token errors

        try {
            const result = await sendEmailConfirmationAction(user?.email || emailFromUrl, null);
            if (result.success) {
                toast.success(result.message);
                setCountdown(initialCountdown);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error(t('checkEmail.error'));
        } finally {
            setIsResending(false);
        }
    };

    const isButtonDisabled = (countdown > 0 && !tokenError) || isResending || isValidatingToken;

    return (
        <div className="flex items-center justify-center h-[calc(100vh-65px)] py-12 md:py-0">
            <Card className="w-full max-w-md py-12 px-6 grid gap-6">
                <CardHeader className="space-y-1 flex flex-col items-center gap-5">
                    <Logo className="h-15 w-15 text-blue-700" />
                    <CardTitle className="text-2xl font-bold text-center">
                        {t('checkEmail.title')}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t('checkEmail.description', { email: user?.email || emailFromUrl })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {/* Show loading state when validating token */}
                    {isValidatingToken && (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                {t('checkEmail.validating')}
                            </p>
                        </div>
                    )}

                    {/* Show token error if validation failed */}
                    {tokenError && (
                        <div className="text-center">
                            <p className="text-sm text-red-600 mb-2">
                                {tokenError}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {t('checkEmail.requestNewEmail')}
                            </p>
                        </div>
                    )}

                    {/* Show countdown only if no token error and not validating */}
                    {!tokenError && !isValidatingToken && (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                {t('checkEmail.noEmail')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {t('checkEmail.requestAnother')}
                            </p>
                            {countdown > 0 && (
                                <p className="text-2xl font-bold text-blue-700 mt-2">
                                    {countdown} {t('checkEmail.seconds')}
                                </p>
                            )}
                        </div>
                    )}

                    <Button
                        onClick={handleResendEmail}
                        disabled={isButtonDisabled}
                        className="w-full"
                    >
                        {isResending ? t('checkEmail.sending') : t('checkEmail.resend')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
} 