'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { User } from '@/components/shared/add-user-dialog';
import { Input } from '@/components/ui/input';
import { useRef, useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { updateCompany } from '@/components/actions/company-action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLoading } from '@/components/LoadingProvider';
import { useUser } from '../UserProvider';
import { Company } from '@/components/types/strapi';

export function EditCompanyForm({ company }: { company: Company }) {
    const t = useTranslations('company');
    const router = useRouter();
    const { user, setUser } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setIsLoading } = useLoading();
    const userListRef = useRef<UserListRef>(null);


    console.log('company', company);

    const { register, handleSubmit, formState: { errors }, setValue, watch, clearErrors } = useForm<Company>({
        defaultValues: {
            name: company.name,
            documentType: company.documentType,
            document: company.document,
            zipCode: company.zipCode,
            state: company.state,
            city: company.city,
            address: company.address,
        }
    });
    const documentType = watch('documentType');

    const onSubmit = async (data: Company) => {
        try {
            setIsSubmitting(true);
            setIsLoading(true);

            // Remove masking from cpf, cnpj, and zipcode
            const cleanData = {
                ...data,
                document: data.document ? data.document.replace(/\D/g, '') : undefined,
                zipCode: data.zipCode.replace(/\D/g, '')
            };

            // Get users from the UserList component
            const users = userListRef.current?.getUsers() || [];

            // Combine form data with users
            const formData = {
                ...cleanData,
                users,
                id: company.id
            };

            const image = new FormData();
            if (data.logo?.[0]) {
                image.append('logo', data.logo[0]);
            }

            const result = await updateCompany(formData, image);

            if (result.success) {
                toast.success(t('companyUpdated'));
                setUser({ ...user, company: result.data });
                router.push('/');
            } else {
                toast.error(result.error || t('companyUpdateError'));
                setIsLoading(false);
            }
        } catch (error) {
            toast.error(t('companyUpdateError'));
            console.error('Error updating company:', error);
            setIsLoading(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clean up loading state when component unmounts
    useEffect(() => {
        return () => {
            setIsLoading(false);
        };
    }, [setIsLoading]);

    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-semibold mb-2">
                {t('editTitle')}
            </h2>
            <UploadPhoto
                register={register}
                setValue={setValue}
                type="logo"
                name="logo"
                label={t('uploadLogo')}
                hint={t('uploadLogoHint')}
                initialFiles={company.logo ? [company.logo] : []}
                onRemoveImage={() => {
                    console.log('remove image');
                }}
            />

            <div>
                <label className="font-semibold">{t('companyName')}</label>
                <Input
                    {...register('name', { required: t('companyName') + ' is required' })}
                    placeholder={t('companyNamePlaceholder')}
                    className="mt-1"
                    disabled={isSubmitting}
                />
                {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold">{t('documentType')}</label>
                    <Select
                        value={documentType}
                        onValueChange={value => {
                            setValue('documentType', value as 'CPF' | 'CNPJ');
                            clearErrors(['document']);
                        }}
                        disabled={isSubmitting}
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
                {documentType === 'CPF' && (
                    <div>
                        <label className="font-semibold">{t('cpf')}</label>
                        <Input
                            {...register('document', {
                                required: t('cpf') + ' is required',
                                pattern: {
                                    value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                                    message: 'Formato inválido. Use 000.000.000-00'
                                }
                            })}
                            placeholder={t('cpfPlaceholder')}
                            className="mt-1"
                            maxLength={14}
                            disabled={isSubmitting}
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
                        {errors.document && (
                            <p className="text-sm text-red-500 mt-1">{errors.document.message}</p>
                        )}
                    </div>
                )}
                {documentType === 'CNPJ' && (
                    <div>
                        <label className="font-semibold">{t('cnpj')}</label>
                        <Input
                            {...register('document', {
                                required: t('cnpj') + ' is required',
                                pattern: {
                                    value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                                    message: 'Formato inválido. Use 00.000.000/0001-00'
                                }
                            })}
                            placeholder={t('cnpjPlaceholder')}
                            className="mt-1"
                            maxLength={18}
                            disabled={isSubmitting}
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
                        {errors.document && (
                            <p className="text-sm text-red-500 mt-1">{errors.document.message}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold">{t('zipcode')}</label>
                    <Input
                        {...register('zipCode', {
                            required: t('zipcode') + ' is required',
                            pattern: {
                                value: /^\d{5}-\d{3}$/,
                                message: 'Formato inválido. Use 00000-000'
                            }
                        })}
                        placeholder={t('zipcodePlaceholder')}
                        className="mt-1"
                        maxLength={9}
                        disabled={isSubmitting}
                        onChange={e => {
                            // Mask Zipcode
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 8) value = value.slice(0, 8);
                            value = value.replace(/(\d{5})(\d)/, '$1-$2');
                            e.target.value = value;
                        }}
                    />
                    {errors.zipCode && (
                        <p className="text-sm text-red-500 mt-1">{errors.zipCode.message}</p>
                    )}
                </div>
                <div>
                    <label className="font-semibold">{t('state')}</label>
                    <Input
                        {...register('state', { required: t('state') + ' is required' })}
                        placeholder={t('statePlaceholder')}
                        className="mt-1"
                        maxLength={2}
                        disabled={isSubmitting}
                    />
                    {errors.state && (
                        <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="font-semibold">{t('city')}</label>
                <Input
                    {...register('city', { required: t('city') + ' is required' })}
                    placeholder={t('cityPlaceholder')}
                    className="mt-1"
                    disabled={isSubmitting}
                />
                {errors.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                )}
            </div>

            <div>
                <label className="font-semibold">{t('companyAddress')}</label>
                <textarea
                    {...register('address', { required: t('companyAddress') + ' is required' })}
                    className="w-full mt-1 rounded-md border px-3 py-2 text-sm"
                    rows={3}
                    placeholder={t('companyAddressPlaceholder')}
                    disabled={isSubmitting}
                />
                {errors.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                )}
            </div>

            <UserList
                ref={userListRef}
                disabled={isSubmitting}
            />

            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="submit"
                    className="py-2 px-4 rounded-lg bg-blue-700 text-white font-semibold disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t('updating') : t('update')}
                </button>
            </div>
        </form>
    );
} 