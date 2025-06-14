"use client";
import { useForm } from 'react-hook-form';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { useTranslations } from 'next-intl';

export function FileUploadBox({ onFiles }: { onFiles: (files: File[]) => void }) {
    const { register, setValue } = useForm();
    const t = useTranslations('form.files');

    return (
        <UploadPhoto
            register={register}
            setValue={setValue}
            name="files"
            label={t('label')}
            hint={t('hint')}
            type="carousel"
            onChange={(files) => {
                if (files) {
                    onFiles(Array.isArray(files) ? files : [files]);
                }
            }}
        />
    );
} 