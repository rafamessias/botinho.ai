"use client";
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/components/UserProvider';
import { SelectItem, Select, SelectValue, SelectContent } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { useLoading } from '@/components/LoadingProvider';
import { updateProfileAction, deleteProfileAction } from '@/components/actions/profile-action';
import { DeleteProfileDialog } from '@/components/shared/delete-profile-dialog';
import { Trash2 } from 'lucide-react';

type FormData = {
    name: string;
    phone: string;
    email: string;
    language: 'en' | 'pt-BR';
    avatar: File[] | null;
    notifyRDO: boolean;
};

export default function ProfileForm() {
    const router = useRouter();
    const t = useTranslations('profile');
    const { user, setUser, setLoading } = useUser();
    const { setIsLoading } = useLoading();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue,
        register,
        reset,
    } = useForm<FormData>({
        defaultValues: {
            name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
            phone: user?.phone || '',
            email: user?.email || '',
            language: user?.language || 'en',
            avatar: user?.avatar ? [user.avatar] : null,
            notifyRDO: false,
        },
        mode: 'onBlur',
    });

    // Update form when user data is available
    useEffect(() => {
        if (user) {
            reset({
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                phone: user.phone || '',
                email: user.email || '',
                language: user.language || 'en',
                avatar: user.avatar ? [user.avatar] : null,
                notifyRDO: false,
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: FormData) => {
        if (!user?.id) {
            toast.error('User not found');
            return;
        }

        setLoading(true);

        try {
            // Split name into firstName and lastName
            const nameParts = data.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Prepare update data
            const updateData = {
                firstName,
                lastName,
                phone: data.phone,
                language: data.language,
                avatar: data.avatar && data.avatar.length > 0 ? data.avatar[0] : null,
            };

            // Update user profile using Prisma action
            const response = await updateProfileAction(updateData);

            if (!response.success || response.error) {
                console.error('Failed to update user:', response.error);
                toast.error(response.error || 'Failed to update profile');
                return;
            }

            // Update user context with new data
            if (response.data) {
                setUser(response.data);
            }

            toast.success(t('success'));
            router.refresh();

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (file: File | File[] | null) => {
        if (file) {
            const fileList = Array.isArray(file) ? file : [file];
            setValue('avatar', fileList);
        } else {
            setValue('avatar', []);
        }
    };

    const handleDeleteProfile = async () => {
        if (!user?.id) {
            toast.error('User not found');
            return;
        }

        setIsDeleting(true);
        setLoading(true);

        try {
            const result = await deleteProfileAction();

            if (result.success) {
                toast.success(t('delete.success'));
                setUser(null);
                router.push('/sign-in');
            } else {
                toast.error(result.error || t('delete.error'));
            }
        } catch (error) {
            console.error('Error deleting profile:', error);
            toast.error(t('delete.error'));
        } finally {
            setIsDeleting(false);
            setLoading(false);
        }
    };

    // Check if user is a company owner (cannot delete profile)
    const isCompanyOwner = user?.companyMember?.isOwner;

    // Show loading state while user is being fetched
    if (!user) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="h-8 w-8 rounded-full bg-primary animate-pulse" />
            </div>
        );
    }

    return (
        <>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Avatar Upload */}
                <div className="flex gap-2">
                    <Controller
                        name="avatar"
                        control={control}
                        render={({ field }) => (
                            <UploadPhoto
                                register={register}
                                setValue={setValue}
                                name="avatar"
                                label={t('avatar.label')}
                                hint={t('avatar.hint')}
                                type="logo"
                                currentImage={typeof user.avatar === 'object' && user.avatar && 'url' in user.avatar ? user.avatar.url : undefined}
                                onChange={handleAvatarChange}
                            />
                        )}
                    />
                </div>

                {/* Name */}
                <div>
                    <label className="block font-semibold mb-1">{t('name.label')}</label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: t('name.required') }}
                        render={({ field }) => (
                            <Input placeholder={t('name.placeholder')} {...field} />
                        )}
                    />
                    {errors.name && (
                        <span className="text-red-500 text-xs mt-1">{errors.name.message as string}</span>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block font-semibold mb-1">{t('phone.label')}</label>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t('phone.placeholder')}
                                {...field}
                                onChange={(e) => {
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
                                    field.onChange(masked);
                                }}
                                maxLength={15}
                            />
                        )}
                    />
                </div>

                {/* Email - Read Only */}
                <div>
                    <label className="block font-semibold mb-1">{t('email.label')}</label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t('email.placeholder')}
                                {...field}
                                readOnly
                                className="bg-gray-100 cursor-not-allowed"
                            />
                        )}
                    />
                </div>

                {/* Language */}
                <div>
                    <label className="block font-semibold mb-1">{t('language.label')}</label>
                    <Controller
                        name="language"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('language.placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">🇺🇸 {t('language.en')}</SelectItem>
                                    <SelectItem value="pt-BR">🇧🇷 {t('language.ptbr')}</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* RDO Notification Toggle */}
                <div className="flex items-center justify-between">
                    <label className="font-semibold" htmlFor="notifyRDO">{t('notifyRDO.label')}</label>
                    <Controller
                        name="notifyRDO"
                        control={control}
                        render={({ field }) => (
                            <Switch id="notifyRDO" checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        {t('actions.cancel')}
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {t('actions.submit')}
                    </Button>
                </div>

                {/* Delete Profile Button - Only show for non-company owners */}
                {!isCompanyOwner && (
                    <div className="border-t pt-6 mt-6">
                        <div className="text-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDeleteDialog(true)}
                                className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                                disabled={isDeleting}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('delete.button')}
                            </Button>
                        </div>
                    </div>
                )}
            </form>

            {/* Delete Profile Dialog */}
            <DeleteProfileDialog
                open={showDeleteDialog}
                onConfirm={handleDeleteProfile}
                onCancel={() => setShowDeleteDialog(false)}
                title={t('delete.title')}
                description={t('delete.description')}
                confirmLabel={t('delete.confirmLabel')}
                cancelLabel={t('delete.cancelLabel')}
                nameConfirmation={t('delete.nameConfirmation')}
                namePlaceholder={t('delete.namePlaceholder')}
                nameRequired={t('delete.nameRequired')}
                nameMismatch={t('delete.nameMismatch')}
                expectedName={`${user.firstName || ''} ${user.lastName || ''}`.trim()}
            />
        </>
    );
} 