"use client";
import { useForm } from 'react-hook-form';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { useTranslations } from 'next-intl';
import { FileImage } from '@/components/types/prisma';

export function FileUploadBox({ onFiles, initialFiles, onRemoveImage }: { onFiles: (files: File[]) => void, initialFiles?: (string | File | FileImage)[], onRemoveImage?: (fileOrUrl: string | File | number) => void }) {
    const { register, setValue } = useForm();
    const t = useTranslations('formRDO.files');

    return (
        <UploadPhoto
            register={register}
            setValue={setValue}
            name="files"
            label={t('label')}
            hint={t('hint')}
            type="carousel"
            initialFiles={initialFiles || []}
            onRemoveImage={onRemoveImage}
            onChange={(files) => {
                if (files) {
                    onFiles(Array.isArray(files) ? files : [files]);
                }
            }}
        />
    );
} 