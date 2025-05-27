'use client';
import { useState } from "react";
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
interface NewPasswordFormValues {
    code: string;
    password: string;
    passwordConfirmation: string;
}

export default function NewPasswordForm() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<NewPasswordFormValues>();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const password = watch('password');
    const router = useRouter();
    const { setUser } = useUser();

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    const onSubmit = async (data: NewPasswordFormValues) => {
        setIsLoading(true);
        try {
            const result = await setNewPasswordAction(data.code, data.password, data.passwordConfirmation);
            if (result.success) {
                toast.success(result.message);

                setUser(result.user);

                router.push('/');
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
                    <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter the code from your email and your new password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                        <div className="space-y-2 hidden">
                            <label htmlFor="code" className="font-semibold">Code</label>
                            <Input
                                id="code"
                                type="text"
                                placeholder="Paste the code from your email"
                                value={code || ""}
                                disabled
                                {...register("code", { required: "Code is required" })}
                            />
                            {errors.code && (
                                <p className="text-sm text-red-500">{errors.code.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="font-semibold">New Password</label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
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
                            <label htmlFor="passwordConfirmation" className="font-semibold">Confirm Password</label>
                            <div className="relative">
                                <Input
                                    id="passwordConfirmation"
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    {...register("passwordConfirmation", {
                                        required: "Please confirm your password",
                                        validate: value => value === password || "Passwords do not match"
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
                            {isLoading ? "Resetting..." : "Set New Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 