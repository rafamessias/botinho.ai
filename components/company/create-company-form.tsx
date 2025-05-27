'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { User } from '@/components/shared/add-user-dialog';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface CompanyFormValues {
    companyName: string;
    documentType: 'cpf' | 'cnpj';
    cpf?: string;
    cnpj?: string;
    zipcode: string;
    state: string;
    city: string;
    companyAddress: string;
    companyLogo?: FileList;
    users: User[];
}

export function CreateCompanyForm() {
    const t = useTranslations('company');
    const userListRef = useRef<UserListRef>(null);
    const { register, handleSubmit, formState: { errors }, setValue, watch, clearErrors } = useForm<CompanyFormValues>({
        defaultValues: { documentType: 'cnpj' }
    });
    const documentType = watch('documentType');

    const onSubmit = (data: CompanyFormValues) => {
        // Remove masking from cpf, cnpj, and zipcode
        const cleanData = {
            ...data,
            cpf: data.cpf ? data.cpf.replace(/\D/g, '') : undefined,
            cnpj: data.cnpj ? data.cnpj.replace(/\D/g, '') : undefined,
            zipcode: data.zipcode.replace(/\D/g, '')
        };

        // Get users from the UserList component
        const users = userListRef.current?.getUsers() || [];

        // Combine form data with users
        const formData = {
            ...cleanData,
            users
        };

        // handle company creation
        console.log(formData);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-semibold mb-2">
                {t('createTitle')}
            </h2>
            <UploadPhoto
                register={register}
                setValue={setValue}
                type="logo"
                name="companyLogo"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold">{t('documentType')}</label>
                    <Select
                        value={documentType}
                        onValueChange={value => {
                            setValue('documentType', value as 'cpf' | 'cnpj');
                            clearErrors(['cpf', 'cnpj']);
                        }}
                    >
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder={t('documentTypePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cpf">{t('cpf')}</SelectItem>
                            <SelectItem value="cnpj">{t('cnpj')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {documentType === 'cpf' && (
                    <div>
                        <label className="font-semibold">{t('cpf')}</label>
                        <Input
                            {...register('cpf', {
                                required: t('cpf') + ' is required',
                                pattern: {
                                    value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                                    message: 'Formato inválido. Use 000.000.000-00'
                                }
                            })}
                            placeholder={t('cpfPlaceholder')}
                            className="mt-1"
                            maxLength={14}
                            onChange={e => {
                                // Mask CPF
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 11) value = value.slice(0, 11);
                                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                                value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
                                value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
                                e.target.value = value;
                            }}
                        />
                        {errors.cpf && (
                            <p className="text-sm text-red-500">{errors.cpf.message}</p>
                        )}
                    </div>
                )}
                {documentType === 'cnpj' && (
                    <div>
                        <label className="font-semibold">{t('cnpj')}</label>
                        <Input
                            {...register('cnpj', {
                                required: t('cnpj') + ' is required',
                                pattern: {
                                    value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                                    message: 'Formato inválido. Use 00.000.000/0001-00'
                                }
                            })}
                            placeholder={t('cnpjPlaceholder')}
                            className="mt-1"
                            maxLength={18}
                            onChange={e => {
                                // Mask CNPJ
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 14) value = value.slice(0, 14);
                                value = value.replace(/(\d{2})(\d)/, '$1.$2');
                                value = value.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                                value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
                                value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
                                e.target.value = value;
                            }}
                        />
                        {errors.cnpj && (
                            <p className="text-sm text-red-500">{errors.cnpj.message}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold">{t('zipcode')}</label>
                    <Input
                        {...register('zipcode', {
                            required: t('zipcode') + ' is required',
                            pattern: {
                                value: /^\d{5}-\d{3}$/,
                                message: 'Formato inválido. Use 00000-000'
                            }
                        })}
                        placeholder={t('zipcodePlaceholder')}
                        className="mt-1"
                        maxLength={9}
                        onChange={e => {
                            // Mask Zipcode
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 8) value = value.slice(0, 8);
                            value = value.replace(/(\d{5})(\d)/, '$1-$2');
                            e.target.value = value;
                        }}
                    />
                    {errors.zipcode && (
                        <p className="text-sm text-red-500">{errors.zipcode.message}</p>
                    )}
                </div>
                <div>
                    <label className="font-semibold">{t('state')}</label>
                    <Input
                        {...register('state', { required: t('state') + ' is required' })}
                        placeholder={t('statePlaceholder')}
                        className="mt-1"
                        maxLength={2}
                    />
                    {errors.state && (
                        <p className="text-sm text-red-500">{errors.state.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="font-semibold">{t('city')}</label>
                <Input
                    {...register('city', { required: t('city') + ' is required' })}
                    placeholder={t('cityPlaceholder')}
                    className="mt-1"
                />
                {errors.city && (
                    <p className="text-sm text-red-500">{errors.city.message}</p>
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

            <UserList
                ref={userListRef}
            />

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