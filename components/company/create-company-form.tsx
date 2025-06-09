'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { Input } from '@/components/ui/input';
import { useRef, useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { createCompany } from '@/components/actions/company-action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLoading } from '@/components/LoadingProvider';
import { useUser } from '../UserProvider';
import { Company, CompanyMemberDialog, ApiResponse } from '@/components/types/strapi';

export function CreateCompanyForm() {
    const t = useTranslations('company');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setIsLoading } = useLoading();
    const userListRef = useRef<UserListRef>(null);
    const { register, handleSubmit, formState: { errors }, setValue, watch, clearErrors } = useForm<Company>({
        defaultValues: { documentType: 'CNPJ' }
    });
    const documentType = watch('documentType');
    const { setUser } = useUser();
    const { user } = useUser();


    const onSubmit = async (data: Company) => {
        try {
            setIsSubmitting(true);
            setIsLoading(true);

            // Remove masking from cpf, cnpj, and zipcode
            const cleanData: Company = {
                ...data,
                document: data.document ? data.document.replace(/\D/g, '') : '',
                zipCode: data.zipCode.replace(/\D/g, '')
            };

            // Get users from the UserList component
            const userMembers: CompanyMemberDialog[] = userListRef.current?.getUsers() || [];

            const image = new FormData();
            if (data.logo instanceof FileList && data.logo.length > 0) {
                image.append('logo', data.logo[0]);
            } else if (data.logo instanceof File) {
                image.append('logo', data.logo);
            }

            const result: ApiResponse<Company> = await createCompany(cleanData, userMembers, image);

            if (result.success) {
                toast.success(t('companyCreated'));
                setUser({ ...user, company: result.data });
                router.push('/');

            } else {
                toast.error(result.error || t('companyCreationError'));

                if (result?.data) {
                    setUser({ ...user, company: result.data });
                    router.push('/');
                }

                setIsLoading(false);
            }
        } catch (result: any) {
            toast.error(t('companyCreationError'));
            console.error('Error creating company:', result?.error);

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
                {t('createTitle')}
            </h2>
            <UploadPhoto
                register={register}
                setValue={setValue}
                type="logo"
                name="logo"
                label={t('uploadLogo')}
                hint={t('uploadLogoHint')}
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
                            setValue('document', ''); 234
                            clearErrors(['document']);
                        }}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder={t('documentTypePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CPF">{t('cpf')}</SelectItem>
                            <SelectItem value="CNPJ">{t('cnpj')}</SelectItem>
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
                <label className="font-semibold">{t('address')}</label>
                <textarea
                    {...register('address', { required: t('address') + ' is required' })}
                    className="w-full mt-1 rounded-md border px-3 py-2 text-sm"
                    rows={3}
                    placeholder={t('addressPlaceholder')}
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
                    {isSubmitting ? t('creating') : t('create')}
                </button>
            </div>
        </form>
    );
} 