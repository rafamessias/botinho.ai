'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from '@/components/logo';
import { signIn } from '@/lib/strapi';
import { useRouter } from '@/i18n/navigation';
import { useUser } from '@/components/UserProvider';

interface SignInFormValues {
    email: string;
    password: string;
}

export function SignInForm() {
    const t = useTranslations('auth');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useUser();

    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>();

    const onSubmit = async (data: SignInFormValues) => {
        setIsLoading(true);
        try {
            const response = await signIn(data.email, data.password);
            setUser(response.user);

            router.push('/');
            toast.success("You have been signed in successfully.");
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement Google sign in logic
            toast.success("You have been signed in with Google successfully.");
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md py-12 px-6 grid gap-6">
            <CardHeader className="flex flex-col items-center gap-5">
                <Logo className="h-15 w-15 text-blue-700" />
                <CardTitle className="text-2xl font-bold text-center">
                    {t('signIn')}
                </CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
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
                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t('signIn')}
                    </Button>
                </form>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
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
                    Google
                </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                    Don't have an account?{' '}
                    <a href="/sign-up" className="text-primary hover:underline">
                        {t('signUp')}
                    </a>
                </div>
            </CardFooter>
        </Card>
    );
} 