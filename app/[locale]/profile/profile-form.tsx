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
import { SelectItem, Select, SelectValue, SelectContent } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { useLoading } from '@/components/LoadingProvider';
import { updateProfileAction, deleteProfileAction } from '@/components/actions/profile-action';
import { DeleteProfileDialog } from '@/components/shared/delete-profile-dialog';
import { Trash2 } from 'lucide-react';
import { deleteFileFromCloudinary } from '@/components/actions/cloudinary-upload-action';
import { uploadToCloudinary } from '@/lib/client-upload';
import { createFileRecords } from '@/components/actions/client-upload-action';
import { FileImage } from '@/components/types/prisma';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

type FormData = {
    name: string;
    phone: string;
    email: string;
    language: 'en' | 'pt-BR';
    avatar: File[] | FileImage[] | null;
    notifyRDO: boolean;
};

export default function ProfileForm() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('profile');
    const { user, setUser, setLoading } = useUser();
    const { setIsLoading } = useLoading();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showImageConfirm, setShowImageConfirm] = useState(false);
    const [pendingImageChange, setPendingImageChange] = useState<File | null>(null);
    const [imageToUpload, setImageToUpload] = useState<File | null>(null);
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>((user?.avatar as FileImage)?.url || null);
    const [uploadPhotoKey, setUploadPhotoKey] = useState(0);

    const avatar: FileImage = user?.avatar as FileImage;

    // Update currentAvatarUrl when user avatar changes
    useEffect(() => {
        setCurrentAvatarUrl((user?.avatar as FileImage)?.url || null);
    }, [(user?.avatar as FileImage)?.url]);

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
            language: user?.language as 'en' | 'pt-BR' || 'en',
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

    const handleImageChange = async (file: any | null) => {
        if (file) {
            setShowImageConfirm(true);
            setPendingImageChange(file[0]);
        }
    };

    const confirmImageChange = async () => {
        if (!pendingImageChange || !user?.id) return;

        try {
            setIsLoading(true);

            // Delete old avatar if exists
            if (avatar?.id) {
                await deleteFileFromCloudinary(avatar.id);
                setValue('avatar', null);
            }

            // DEPRECATED: File uploads are now handled client-side
            // Upload new avatar
            /*
            const uploadResult = await uploadFileToCloudinary({
                file: pendingImageChange,
                tableName: 'User',
                recordId: user.id,
                fieldName: 'avatarId',
                folder: 'obraguru/avatars'
            });

            if (!uploadResult.success || !uploadResult.data) {
                throw new Error('Failed to upload avatar');
            }

            // Update form state with the uploaded image data
            setValue('avatar', [uploadResult.data]);
            setImageToUpload(pendingImageChange);
            setCurrentAvatarUrl(uploadResult.data.url);

            // Update user context immediately
            setUser({
                ...user,
                avatar: uploadResult.data
            });
            */

            // Upload new avatar to Cloudinary
            const uploadResults = await uploadToCloudinary([pendingImageChange], 'obraguru/avatars');

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
                recordId: user.id,
                fieldName: 'avatar'
            });

            if (!fileRecordsResponse.success) {
                throw new Error(fileRecordsResponse.error || 'Failed to create file record');
            }

            // Update form state with the uploaded image data
            const uploadedFile = fileRecordsResponse.data?.[0];
            if (uploadedFile) {
                setValue('avatar', [uploadedFile]);
                setImageToUpload(pendingImageChange);
                setCurrentAvatarUrl(uploadedFile.url);

                // Update user context immediately
                setUser({
                    ...user,
                    avatar: uploadedFile
                });
            }

            toast.success('Avatar updated successfully');
        } catch (error) {
            console.error('Error updating avatar:', error);
            toast.error('Failed to update avatar');
        } finally {
            setIsLoading(false);
            setShowImageConfirm(false);
            setPendingImageChange(null);
        }
    };

    const cancelImageChange = () => {
        setShowImageConfirm(false);
        setPendingImageChange(null);
        // Reset form state to current avatar if any
        setValue('avatar', user?.avatar ? [user.avatar as FileImage] : null);
        setCurrentAvatarUrl((user?.avatar as FileImage)?.url || null);
        // Force UploadPhoto component to re-render with original state
        setUploadPhotoKey(prev => prev + 1);
    };

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

            // Prepare update data (avatar is already handled separately)
            const updateData = {
                firstName,
                lastName,
                phone: data.phone,
                language: data.language,
                avatar: null, // Avatar is already handled separately
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
        }
    };

    const handleAvatarChange = (file: File | File[] | null) => {
        if (file) {
            const fileList = Array.isArray(file) ? file : [file];
            // Don't update form state yet, wait for confirmation
            // setValue('avatar', fileList);
            handleImageChange(fileList);
        } else {
            setValue('avatar', []);
        }
    };

    const handleRemoveImage = async () => {
        try {
            setIsLoading(true);
            // Delete old file if exists
            if ((user?.avatar as FileImage)?.id) {
                await deleteFileFromCloudinary((user?.avatar as FileImage)?.id as number);
            }

            // Update form state to remove avatar
            setValue('avatar', null);
            setImageToUpload(null);
            setCurrentAvatarUrl(null);

            // Update user context to remove avatar
            setUser({
                ...user!,
                email: user!.email || '',
                avatar: null as unknown as FileImage
            });

            toast.success(t('avatarRemoved'));
        } catch (error) {
            console.error('Error removing avatar:', error);
            toast.error(`${t('avatarRemoveError')} - ${error instanceof Error ? error.message : t('avatarRemoveError')}`);
        } finally {
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
                    <EnhancedUploadPhoto
                        key={`${currentAvatarUrl || 'no-avatar'}-${uploadPhotoKey}`} // Force re-render when avatar changes or when canceling
                        register={register}
                        setValue={setValue}
                        name="avatar"
                        label={t('avatar.label')}
                        hint={t('avatar.hint')}
                        type="logo"
                        initialFiles={currentAvatarUrl ? [currentAvatarUrl] : []}
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

            {/* Image Change Confirmation Dialog */}
            <ConfirmDialog
                open={showImageConfirm}
                onConfirm={confirmImageChange}
                onCancel={cancelImageChange}
                title={t('avatar.changePhotoTitle')}
                description={t('avatar.changePhotoDescription')}
                confirmLabel={t('avatar.changePhotoConfirmLabel')}
                cancelLabel={t('avatar.changePhotoCancelLabel')}
            />
        </>
    );
} 