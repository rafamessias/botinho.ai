'use client';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { Logo } from '@/components/logo';
import { setNewPasswordAction } from '@/components/actions/set-new-password-action';
import { useRouter } from "@/i18n/navigation";
import { useUser } from "@/components/UserProvider";
import { useTranslations } from 'next-intl';

interface NewPasswordFormValues {
    code: string;
    password: string;
    passwordConfirmation: string;
}

export default function NewPasswordForm() {
    const t = useTranslations('auth');
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<NewPasswordFormValues>();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const password = watch('password');
    const router = useRouter();
    const { setUser } = useUser();

    // Use useEffect to safely access window and set code in form
    useEffect(() => {
        // Clean up user context when component mounts
        setUser(null);

        // Get token from URL and set as code in form
        if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search);
            const code = searchParams.get('token') || "";
            setValue("code", code);
        }
    }, [setUser, setValue]);

    const onSubmit = async (data: NewPasswordFormValues) => {
        setIsLoading(true);
        try {
            const result = await setNewPasswordAction(data.code, data.password, data.passwordConfirmation);
            if (result.success) {
                toast.success(result.message);

                setUser(result.user);

                router.push('/');
                router.refresh();
            } else {
                console.log(result);
                toast.error(result.error);
            }
        } catch (error) {
            console.log(error);
            toast.error(error instanceof Error ? error.message : String(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md py-12 px-6 grid gap-6">
                <CardHeader className="space-y-1 flex flex-col items-center gap-5">
                    <Logo className="h-15 w-15 text-blue-700" />
                    <CardTitle className="text-2xl font-bold text-center">{t('newPassword.title')}</CardTitle>
                    <CardDescription className="text-center">
                        {t('newPassword.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                        <div className="space-y-2 hidden">
                            <label htmlFor="code" className="font-semibold">{t('newPassword.code')}</label>
                            <Input
                                id="code"
                                type="text"
                                placeholder={t('newPassword.codePlaceholder')}
                                disabled
                                {...register("code", { required: t('newPassword.errors.codeRequired') })}
                            />
                            {errors.code && (
                                <p className="text-sm text-red-500">{errors.code.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="font-semibold">{t('newPassword.newPassword')}</label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('newPassword.newPasswordPlaceholder')}
                                    {...register("password", {
                                        required: t('newPassword.errors.passwordRequired'),
                                        minLength: {
                                            value: 6,
                                            message: t('newPassword.errors.passwordMinLength')
                                        }
                                    })}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(showPassword ? false : true)}
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
                            <label htmlFor="passwordConfirmation" className="font-semibold">{t('newPassword.confirmPassword')}</label>
                            <div className="relative">
                                <Input
                                    id="passwordConfirmation"
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    placeholder={t('newPassword.confirmPasswordPlaceholder')}
                                    {...register("passwordConfirmation", {
                                        required: t('newPassword.errors.confirmPasswordRequired'),
                                        validate: value => value === password || t('newPassword.errors.passwordsDoNotMatch')
                                    })}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPasswordConfirmation(showPasswordConfirmation ? false : true)}
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {errors.passwordConfirmation && (
                                <p className="text-sm text-red-500">{errors.passwordConfirmation.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                            {isLoading ? t('newPassword.resetting') : t('newPassword.setNewPassword')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 