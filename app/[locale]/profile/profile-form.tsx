"use client";
import { useForm, Controller } from 'react-hook-form';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { EnhancedUploadPhoto } from '@/components/shared/enhanced-upload-photo';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/components/getUser';
import { SelectItem, Select, SelectContent } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@/components/ui/select';
import { useLoading } from '@/components/LoadingProvider';
import { updateProfileAction, deleteProfileAction } from '@/components/actions/profile-action';
import { Trash2 } from 'lucide-react';
import { deleteFileFromCloudinary } from '@/components/actions/cloudinary-upload-action';
import { uploadToCloudinary } from '@/lib/client-upload';
import { createFileRecords } from '@/components/actions/client-upload-action';
import { FileImage } from '@/components/types/prisma';
import { Skeleton } from '@/components/ui/skeleton';

type FormData = {
    name: string;
    phone: string;
    email: string;
    language: 'en' | 'pt-BR';
    avatar: File[] | FileImage[] | null;
    notifyRDO: boolean;
};

type PendingAvatarChange = {
    type: 'upload' | 'edit' | 'remove';
    file?: File;
    currentAvatar?: FileImage;
};

export default function ProfileForm() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('profile');
    const { user, setUser, setLoading } = useUser();
    const { setIsLoading } = useLoading();
    const [isDeleting, setIsDeleting] = useState(false);
    const [pendingAvatarChange, setPendingAvatarChange] = useState<PendingAvatarChange | null>(null);
    const [uploadPhotoKey, setUploadPhotoKey] = useState(0);

    const avatar: FileImage = user?.avatar as FileImage;

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue,
        getValues,
        register,
        reset,
    } = useForm<FormData>({
        defaultValues: {
            name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
            phone: user?.phone || '',
            email: user?.email || '',
            language: (user?.language as 'en' | 'pt-BR') || 'en',
            avatar: user?.avatar ? [user.avatar as FileImage] : null,
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
                language: user.language as 'en' | 'pt-BR' || 'en',
                avatar: user.avatar ? [user.avatar as FileImage] : null,
                notifyRDO: false,
            });
        }
    }, [user, reset]);

    // Get the current avatar to display (either pending change or current)
    const getCurrentAvatarForDisplay = () => {
        if ((pendingAvatarChange?.type === 'upload' || pendingAvatarChange?.type === 'edit') && pendingAvatarChange.file) {
            // Return a temporary URL for the pending file
            return [URL.createObjectURL(pendingAvatarChange.file)];
        } else if (pendingAvatarChange?.type === 'remove') {
            // Return empty array for removal
            return [];
        } else {
            // Return current avatar
            return avatar?.url ? [avatar.url] : [];
        }
    };

    const handleAvatarChange = (file: File | File[] | null) => {
        if (file) {
            const fileList = Array.isArray(file) ? file : [file];
            // For single file uploads (like avatar), we expect only one file
            const newFile = fileList[0];

            // Determine if this is an edit (replacing existing avatar) or upload (no existing avatar)
            const changeType = avatar ? 'edit' : 'upload';

            setPendingAvatarChange({
                type: changeType,
                file: newFile,
                currentAvatar: avatar
            });
        } else {
            setPendingAvatarChange({
                type: 'remove',
                currentAvatar: avatar
            });
        }
    };

    const handleRemoveImage = () => {
        setPendingAvatarChange({
            type: 'remove',
            currentAvatar: avatar
        });
    };

    const resetPendingAvatarChange = () => {
        setPendingAvatarChange(null);
        // Reset form state to current avatar
        setValue('avatar', user?.avatar ? [user.avatar as FileImage] : null);
        // Force UploadPhoto component to re-render with original state
        setUploadPhotoKey(prev => prev + 1);
    };

    const onSubmit = async (data: FormData) => {
        if (!user?.id) {
            toast.error('User not found');
            return;
        }

        setLoading(true);
        setIsLoading(true);

        try {
            // Handle pending avatar changes first
            if (pendingAvatarChange) {
                if ((pendingAvatarChange.type === 'upload' || pendingAvatarChange.type === 'edit') && pendingAvatarChange.file) {
                    // For edit type, delete old avatar first
                    if (pendingAvatarChange.type === 'edit' && pendingAvatarChange.currentAvatar?.id) {
                        await deleteFileFromCloudinary(pendingAvatarChange.currentAvatar.id);
                    }

                    // Upload new avatar to Cloudinary
                    const uploadResults = await uploadToCloudinary([pendingAvatarChange.file], 'obraguru/avatars');

                    // Transform results to ClientUploadResult format
                    const clientUploadResults = uploadResults
                        .filter(result => result.success && result.data)
                        .map(result => result.data!);

                    if (clientUploadResults.length === 0) {
                        throw new Error('Failed to upload avatar');
                    }

                    // Create file record in database
                    const fileRecordsResponse = await createFileRecords({
                        uploadResults: clientUploadResults,
                        tableName: 'user',
                        recordId: user!.id,
                        fieldName: 'avatar'
                    });

                    if (!fileRecordsResponse.success) {
                        throw new Error(fileRecordsResponse.error || 'Failed to create file record');
                    }

                    // Update form data with the uploaded file
                    const uploadedFile = fileRecordsResponse.data?.[0];
                    if (uploadedFile) {
                        data.avatar = [uploadedFile as FileImage];
                    }
                } else if (pendingAvatarChange.type === 'remove') {
                    // Delete current avatar if exists
                    if (pendingAvatarChange.currentAvatar?.id) {
                        await deleteFileFromCloudinary(pendingAvatarChange.currentAvatar.id);
                    }
                    data.avatar = null;
                }
            }

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
                ...(data.avatar && { avatarId: (data.avatar as FileImage[])?.[0]?.id }),
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

            // Clear pending avatar change
            setPendingAvatarChange(null);

            toast.success(t('success'));

            // Compare current locale with response.data.language, if different redirect to new locale
            if (response.data && response.data.language && locale !== response.data.language) {
                // Replace the current locale in the pathname with the new locale
                const newPath = pathname.replace(`/${locale}`, `/${response.data.language}`);
                router.push(newPath);
                return; // Prevent further execution
            }
            router.refresh();

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(t('error'));
        } finally {
            setLoading(false);
            setIsLoading(false);
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

            <div className="relative mx-auto w-full max-w-[680px] px-6 py-6">
                <div className="flex flex-col gap-6">
                    {/* Avatar Upload */}
                    <div className="flex gap-2">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-20 w-20 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* RDO Notification Toggle */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>

                    {/* Delete Profile Button */}
                    <div className="border-t pt-6 mt-6">
                        <div className="text-center">
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </div>
            </div>

        );
    }

    return (
        <>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Avatar Upload */}
                <div className="flex gap-2">
                    <EnhancedUploadPhoto
                        key={`${uploadPhotoKey}-${pendingAvatarChange ? 'pending' : 'current'}`}
                        register={register}
                        setValue={setValue}
                        name="avatar"
                        label={t('avatar.label')}
                        hint={t('avatar.hint')}
                        type="photo"
                        initialFiles={getCurrentAvatarForDisplay()}
                        onChange={handleAvatarChange}
                        onRemoveImage={handleRemoveImage}
                        maxFiles={1}
                        maxFileSize={10}
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
                                onClick={handleDeleteProfile}
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
        </>
    );
} 