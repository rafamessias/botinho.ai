"use client";
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/components/UserProvider';
import { SelectItem, Select, SelectValue, SelectContent } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { uploadFile } from '@/lib/strapi';
import { useLoading } from '@/components/LoadingProvider';
import { User, StrapiImage } from '@/components/types/strapi';

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
    const { user, setUser } = useUser();
    const { setIsLoading } = useLoading();

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

        setIsLoading(true);

        try {
            // Split name into firstName and lastName
            const nameParts = data.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Prepare user update data
            const updateData: any = {
                firstName,
                lastName,
                phone: data.phone,
                language: data.language,
            };

            // Update user data
            const response = await fetchContentApi(`users/${user.id}`, {
                method: 'PUT',
                body: updateData,
                next: {
                    revalidate: 0,
                    tags: ['me']
                },
                revalidateTag: ['me']
            });

            if (!response.success || response.error) {
                console.error('Failed to update user:', response.error);
                toast.error(response.error || 'Failed to update profile');
                return;
            }

            let updateUserData: User = response.data as User;


            // Handle avatar upload if a new avatar is selected
            if (data.avatar && data.avatar.length > 0 && user.id) {
                const avatarFile = data.avatar[0];
                if (avatarFile instanceof File) {
                    const uploadResponse = await uploadFile(
                        avatarFile,
                        user.id,
                        'plugin::users-permissions.user',
                        'avatar'
                    );

                    if (!uploadResponse.success) {
                        console.error('Failed to upload avatar:', uploadResponse.error);
                        // Don't fail the entire update if avatar upload fails
                        toast.warning('Profile updated but avatar upload failed');
                    } else {
                        if (uploadResponse.data && Array.isArray(uploadResponse.data) && uploadResponse.data.length > 0) {
                            updateUserData.avatar = uploadResponse.data[0] as StrapiImage;
                        }
                    }
                }
            } else if (user.avatar && data.avatar && data.avatar.length === 0) {
                // Delete old avatar if exists
                const deleteResponse = await fetchContentApi<any>(`upload/files/${user.avatar.id}`, {
                    method: 'DELETE'
                });

                if (!deleteResponse.success || deleteResponse.error) {
                    console.error('Failed to delete avatar:', deleteResponse.error);
                } else {
                    console.log('Avatar deleted successfully');
                }
            }

            // Update user context with new data
            if (updateUserData) setUser(updateUserData);

            toast.success(t('success'));
            router.refresh();

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(t('error'));
        } finally {
            setIsLoading(false);
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

    // Show loading state while user is being fetched
    if (!user) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="h-8 w-8 rounded-full bg-primary animate-pulse" />
            </div>
        );
    }

    return (
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
        </form>
    );
} 