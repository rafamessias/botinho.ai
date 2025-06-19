"use client";
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { useState } from 'react';
import { toast } from 'sonner';
import { RDODatePicker } from '@/components/rdo/form/RDODatePicker';

interface ProfileFormProps {
    user: {
        name: string;
        phone: string;
        email: string;
        birthday: string;
        avatar: string;
        notifyRDO: boolean;
    };
}

type FormData = {
    name: string;
    phone: string;
    email: string;
    birthday: string;
    avatar: File[];
    notifyRDO: boolean;
};

export default function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const t = useTranslations('profile');
    const [avatar, setAvatar] = useState<File[]>([]);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue,
        register,
    } = useForm<FormData>({
        defaultValues: {
            name: user.name,
            phone: user.phone,
            email: user.email,
            birthday: user.birthday,
            avatar: [],
            notifyRDO: user.notifyRDO,
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: FormData) => {
        // TODO: Implement profile update logic
        toast.success(t('success'));
        // router.push('/');
    };

    const handleAvatarChange = (file: File | File[] | null) => {
        if (file) {
            const fileList = Array.isArray(file) ? file : [file];
            setAvatar(fileList);
            setValue('avatar', fileList);
        }
    };

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
                            currentImage={user.avatar}
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
                        <Input placeholder={t('phone.placeholder')} {...field} />
                    )}
                />
            </div>

            {/* Email */}
            <div>
                <label className="block font-semibold mb-1">{t('email.label')}</label>
                <Controller
                    name="email"
                    control={control}
                    rules={{ required: t('email.required') }}
                    render={({ field }) => (
                        <Input placeholder={t('email.placeholder')} {...field} />
                    )}
                />
                {errors.email && (
                    <span className="text-red-500 text-xs mt-1">{errors.email.message as string}</span>
                )}
            </div>

            {/* Birthday */}
            <div>
                <label className="block font-semibold mb-1">{t('birthday.label')}</label>
                <Controller
                    name="birthday"
                    control={control}
                    render={({ field }) => (
                        <RDODatePicker
                            value={field.value}
                            onChange={field.onChange}
                        />
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