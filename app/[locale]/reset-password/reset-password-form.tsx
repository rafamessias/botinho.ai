'use client';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { forgotPasswordAction } from '@/components/actions/forgot-password-action';

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email') || '';
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<{ email: string }>({
        defaultValues: { email: emailParam }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (emailParam) setValue('email', emailParam);
    }, [emailParam, setValue]);

    const onSubmit = async (data: { email: string }) => {
        setIsLoading(true);
        try {
            const result = await forgotPasswordAction(data.email);
            if (result.success) {
                toast.success(result.message);
                setIsSuccess(true);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
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
                    <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to receive a password reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="font-semibold">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                disabled={isSuccess}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading || isSuccess}>
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link href="/sign-in" className="text-blue-700 hover:underline">
                            &larr; Back to Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 