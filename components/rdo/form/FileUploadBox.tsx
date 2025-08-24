"use client";
import { useForm } from 'react-hook-form';
import { EnhancedUploadPhoto } from '@/components/shared/enhanced-upload-photo';
import { useTranslations } from 'next-intl';
import { FileImage } from '@/components/types/prisma';

export function FileUploadBox({
  onFiles,
  initialFiles,
  onRemoveImage
}: {
  onFiles: (files: File[]) => void,
  initialFiles?: (string | File | FileImage)[],
  onRemoveImage?: (fileOrUrl: string | File | number) => void
}) {
  const { register, setValue } = useForm();
  const t = useTranslations('formRDO.files');

  return (
    <EnhancedUploadPhoto
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
          onFiles(files);
        }
      }}
      maxFiles={10}
      maxFileSize={50}
    />
  );
} 