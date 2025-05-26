'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { UploadPhoto } from '@/components/shared/upload-photo';
import CompanyTeam from './company-team';
import { Input } from '@/components/ui/input';

interface CompanyFormValues {
    companyName: string;
    companyAddress: string;
    companyCnpj: string;
    companyLogo?: FileList;
}

export function CreateCompanyForm() {
    const t = useTranslations('company');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<CompanyFormValues>();

    const onSubmit = (data: CompanyFormValues) => {
        // handle company creation
        console.log(data);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-semibold mb-2">
                {t('createTitle')}
            </h2>
            <UploadPhoto
                register={register}
                setValue={setValue}
                name="companyLogo"
                photoUrl="/placeholder-image.webp"
                label={t('uploadLogo')}
                hint={t('uploadLogoHint')}
            />

            <div>
                <label className="font-semibold">{t('companyName')}</label>
                <Input
                    {...register('companyName', { required: t('companyName') + ' is required' })}
                    placeholder={t('companyNamePlaceholder')}
                    className="mt-1"
                />
                {errors.companyName && (
                    <p className="text-sm text-red-500">{errors.companyName.message}</p>
                )}
            </div>

            <div>
                <label className="font-semibold">{t('companyAddress')}</label>
                <textarea
                    {...register('companyAddress', { required: t('companyAddress') + ' is required' })}
                    className="w-full mt-1 rounded-md border px-3 py-2 text-sm"
                    rows={3}
                    placeholder={t('companyAddressPlaceholder')}
                />
                {errors.companyAddress && (
                    <p className="text-sm text-red-500">{errors.companyAddress.message}</p>
                )}
            </div>

            <div>
                <label className="font-semibold">{t('companyCnpj')}</label>
                <Input
                    {...register('companyCnpj', { required: t('companyCnpj') + ' is required' })}
                    placeholder={t('companyCnpjPlaceholder')}
                    className="mt-1"
                />
                {errors.companyCnpj && (
                    <p className="text-sm text-red-500">{errors.companyCnpj.message}</p>
                )}
            </div>

            <CompanyTeam />

            <div className="flex gap-4 mt-8">
                <button type="button" className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700">
                    {t('cancel')}
                </button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-700 text-white font-semibold">
                    {t('create')}
                </button>
            </div>
        </form>
    );
} 