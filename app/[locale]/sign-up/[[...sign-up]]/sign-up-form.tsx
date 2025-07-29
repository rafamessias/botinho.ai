'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Logo } from '@/components/logo';
import { signUpAction } from '@/components/actions/auth-actions';
import { useUser } from '@/components/UserProvider';
import { Link } from '@/i18n/navigation';
import { LanguageSwitch } from '@/components/language-switch';
import { signIn } from 'next-auth/react';
import { getUserMe } from '@/components/actions/get-user-me-action';

interface SignUpFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agree: boolean;
}

export default function SignUpForm({ params }: { params: { locale: string } }) {
    const t = useTranslations('auth');
    const { setUser } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { locale } = params;

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<SignUpFormValues>();
    const password = watch('password');
    const agree = watch('agree');

    const onSubmit = async (data: SignUpFormValues) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => formData.append(key, value));
            formData.append('language', locale);

            const result = await signUpAction(formData);

            if (result.success) {
                setIsNavigating(true);
                toast.success(t('signUpSuccess'));
                const user = await getUserMe();
                if (user.success) {
                    setUser(user.data);
                }
                // Redirect to sign-in page after successful signup
                router.push('/sign-up/check-email');
            } else {

                if (result.error === "User already exists") {
                    toast.error(t('userAlreadyExists'));
                } else {
                    toast.error(t('signUpError'));
                }
            }

        } catch (error) {
            toast.error(t('signUpError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        try {
            // Use NextAuth Google provider directly
            const result = await signIn("google", {
                callbackUrl: '/company/create',
                redirect: false,
            });

            if (result?.error) {
                toast.error(t('googleSignUpError'));
            } else {
                setIsNavigating(true);
                // The redirect will be handled by NextAuth
            }
        } catch (error) {
            toast.error(t('signUpError'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Clean up user context when component mounts
        setUser(null);
    }, [setUser]);

    return (
        <Card className="max-w-md py-12 px-0 sm:px-6 grid gap-6 relative">
            {isNavigating && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">{t('redirecting')}</p>
                    </div>
                </div>
            )}
            <CardHeader className="flex flex-col items-center gap-5">
                <div className="absolute top-4 right-4">
                    <LanguageSwitch disabled={isLoading || isNavigating} />
                </div>
                <Logo className="h-15 w-15 text-blue-700" />
                <CardTitle className="text-2xl font-bold text-center">
                    {t('signUp')}
                </CardTitle>
                <CardDescription className="text-center">
                    {t('createAccount')}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t('firstName')}</Label>
                            <Input
                                id="firstName"
                                disabled={isLoading || isNavigating}
                                {...register('firstName', {
                                    required: t('firstNameRequired')
                                })}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-red-500">{errors.firstName.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">{t('lastName')}</Label>
                            <Input
                                id="lastName"
                                disabled={isLoading || isNavigating}
                                {...register('lastName', {
                                    required: t('lastNameRequired')
                                })}
                            />
                            {errors.lastName && (
                                <p className="text-sm text-red-500">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            disabled={isLoading || isNavigating}
                            {...register('email', {
                                required: t('emailRequired'),
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: t('emailInvalid')
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t('phoneNumber')}</Label>
                        <Input
                            id="phone"
                            type="tel"
                            disabled={isLoading || isNavigating}
                            {...register('phone', {
                                required: t('phoneRequired'),
                                pattern: {
                                    value: /^\(\d{2}\) \d{5}-\d{4}$/,
                                    message: t('phoneInvalid')
                                },
                                onChange: (e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length > 11) {
                                        e.target.value = e.target.value.slice(0, 11);
                                        return;
                                    }
                                    const masked = value.replace(
                                        /^(\d{2})(\d{5})(\d{4})?/,
                                        (_: any, ddd: string, first: string, last: string) => {
                                            if (last) return `(${ddd}) ${first}-${last}`;
                                            if (first) return `(${ddd}) ${first}`;
                                            return `(${ddd}`;
                                        }
                                    );
                                    e.target.value = masked;
                                }
                            })}
                            maxLength={15}
                            placeholder={t('phonePlaceholder')}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">{t('password')}</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                disabled={isLoading || isNavigating}
                                {...register('password', {
                                    required: t('passwordRequired'),
                                    minLength: {
                                        value: 6,
                                        message: t('passwordMinLength')
                                    }
                                })}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading || isNavigating}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                disabled={isLoading || isNavigating}
                                {...register('confirmPassword', {
                                    required: t('confirmPasswordRequired'),
                                    validate: value => value === password || t('passwordsDoNotMatch')
                                })}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading || isNavigating}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            id="agree"
                            type="checkbox"
                            disabled={isLoading || isNavigating}
                            {...register('agree', { required: t('agreeRequired') })}
                            className="border rounded cursor-pointer"
                        />
                        <label htmlFor="agree" className="text-sm">
                            {t('agreeToTerms')}{' '}
                            <Link
                                href="/terms"
                                className={`text-blue-700 hover:underline ${(isLoading || isNavigating) ? 'pointer-events-none opacity-50' : ''}`}
                                target="_blank"
                            >
                                {t('termsAndConditions')}
                            </Link>{' '}
                            {t('and')}{' '}
                            <Link
                                href="/privacy"
                                className={`text-blue-700 hover:underline ${(isLoading || isNavigating) ? 'pointer-events-none opacity-50' : ''}`}
                                target="_blank"
                            >
                                {t('privacyPolicy')}
                            </Link>
                        </label>
                    </div>
                    {errors.agree && (
                        <p className="text-sm text-red-500">{errors.agree.message as string}</p>
                    )}
                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={isLoading || isNavigating || !agree}
                    >
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t('signUp')}
                    </Button>
                </form>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            {t('orContinueWith')}
                        </span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={handleGoogleSignUp}
                    disabled={isLoading || isNavigating || !agree}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            />
                        </svg>
                    )}
                    {t('google')}
                </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                    {t('alreadyHaveAccount')}{' '}
                    <Link
                        href="/sign-in"
                        className={`text-primary hover:underline ${(isLoading || isNavigating) ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        {t('signIn')}
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
} 