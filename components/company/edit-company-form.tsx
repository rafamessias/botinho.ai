'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { Input } from '@/components/ui/input';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { updateCompany, createCompanyMember, updateCompanyMember, removeCompanyMember } from '@/components/actions/company-action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLoading } from '@/components/LoadingProvider';
import { useUser } from '../UserProvider';
import { Company, StrapiImage } from '@/components/types/strapi';
import { Button } from '../shared/button';
import { ConfirmDialog } from '../shared/confirm-dialog';
import { CompanyMemberDialog } from '@/components/types/strapi';
import { fetchContentApi } from '../actions/fetch-content-api';
import { Controller } from 'react-hook-form';
import { uploadFile } from '@/lib/strapi';

function maskCPF(value: string) {
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function maskCNPJ(value: string) {
    return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function maskZipCode(value: string) {
    return value.replace(/^(\d{5})(\d{3})$/, "$1-$2");
}

export function EditCompanyForm({ company, companyMembers }: { company: Company, companyMembers: CompanyMemberDialog[] | null }) {
    const t = useTranslations('company');
    const router = useRouter();
    const { user, setUser } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [imageToUpload, setImageToUpload] = useState<File | null>(null);
    const [showImageConfirm, setShowImageConfirm] = useState(false);
    const [pendingImageChange, setPendingImageChange] = useState<File | null>(null);
    const { setIsLoading } = useLoading();
    const userListRef = useRef<UserListRef>(null);

    const logo: StrapiImage = company.logo as StrapiImage;

    const getInitialValues = () => ({
        name: company.name,
        documentType: company.documentType,
        document: company.documentType === 'CPF'
            ? maskCPF(company.document)
            : company.documentType === 'CNPJ'
                ? maskCNPJ(company.document)
                : undefined,
        zipCode: maskZipCode(company.zipCode),
        state: company.state,
        city: company.city,
        address: company.address,
        logo: logo,
        documentId: company.documentId
    });

    const initialValues = useMemo(() => getInitialValues(), [company]);

    const { register, handleSubmit, formState: { errors, isDirty }, setValue, getValues, clearErrors, reset, control, watch } = useForm<Company>({
        defaultValues: initialValues
    });
    const documentType = watch('documentType');

    // Track form changes
    useEffect(() => {
        const hasFormChanges = isDirty || imageToUpload !== null;
        setHasChanges((prev) => prev !== hasFormChanges ? hasFormChanges : prev);
    }, [isDirty, imageToUpload]);

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        reset(initialValues);
        setImageToUpload(null);
        setShowResetConfirm(false);
    };

    const handleAddCompanyMember = async (user: CompanyMemberDialog) => {
        try {
            setIsLoading(true);
            const response = await createCompanyMember({
                companyId: company.id,
                user: {
                    firstName: user.name.split(' ')[0],
                    lastName: user.name.split(' ').slice(1).join(' '),
                    email: user.email,
                    phone: user.phone,
                },
                isAdmin: user.isAdmin,
                canPost: user.canPost,
                canApprove: user.canApprove
            });

            if (!response.success || !response.data) {
                console.error('Error adding company member:', response.error);
                toast.error(t('memberAddError'));
                return false;
            }

            toast.success(t('memberAdded'));

            // Return the updated user data
            return {
                ...user,
                id: response.data.id,
                documentId: response.data.documentId
            };
        } catch (error) {
            console.error('Error adding company member:', error);
            toast.error(t('memberAddError'));
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditCompanyMember = async (user: CompanyMemberDialog) => {
        try {
            console.log("editing company member", user);
            setIsLoading(true);
            const response = await updateCompanyMember({
                documentId: user.documentId,
                isAdmin: user.isAdmin,
                canPost: user.canPost,
                canApprove: user.canApprove
            });

            if (!response.success || !response.data) {
                console.error('Error updating company member:', response.error);
                toast.error(t('memberUpdateError'));
                return false;
            }

            toast.success(t('memberUpdated'));

            // Return the updated user data
            return {
                ...user,
                id: response.data.id,
                documentId: response.data.documentId
            };
        } catch (error) {
            console.error('Error updating company member:', error);
            toast.error(t('memberUpdateError'));
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveCompanyMember = async (user: CompanyMemberDialog) => {
        try {
            setIsLoading(true);
            const response = await removeCompanyMember(user.documentId as string, user.user?.id as number);

            if (!response.success) {
                console.error('Error removing company member:', response.error);
                toast.error(t('memberRemoveError'));
                return false;
            }

            toast.success(t('memberRemoved'));
            return true;
        } catch (error) {
            console.error('Error removing company member:', error);
            toast.error(t('memberRemoveError'));
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = async (file: any | null) => {
        if (file) {
            setPendingImageChange(file);
            setShowImageConfirm(true);
            setShowImageConfirm(true);
        }
    };

    const confirmImageChange = async () => {
        if (!pendingImageChange) return;

        try {
            setIsLoading(true);
            // Delete old file if exists
            if (logo?.id) {
                await fetchContentApi<any>(`/api/upload/files/${logo.id}`, {
                    method: 'DELETE'
                });
            }

            // Upload new file
            const uploadResponse = await uploadFile(
                pendingImageChange,
                company.id as number,
                'api::company.company',
                'logo'
            );

            if (!uploadResponse) {
                throw new Error('Failed to upload new logo');
            }

            setImageToUpload(pendingImageChange);
            toast.success(t('logoUpdated'));
        } catch (error) {
            console.error('Error updating logo:', error);
            toast.error(t('logoUpdateError'));
        } finally {
            setIsLoading(false);
            setShowImageConfirm(false);
            setPendingImageChange(null);
        }
    };

    const cancelImageChange = () => {
        setShowImageConfirm(false);
        setPendingImageChange(null);
    };

    const handleRemoveImage = async () => {
        try {
            setIsLoading(true);
            // Delete old file if exists
            if (logo?.id) {
                await fetchContentApi<any>(`/api/upload/files/${logo.id}`, {
                    method: 'DELETE'
                });
            }
            setImageToUpload(null);
            toast.success(t('logoRemoved'));
        } catch (error) {
            console.error('Error removing logo:', error);
            toast.error(error instanceof Error ? error.message : t('logoRemoveError'));
        } finally {
            setIsLoading(false);
        }
    };

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

            const result = await updateCompany(cleanData);

            if (result.success) {
                toast.success(t('companyUpdated'));
                setUser({ ...user, company: result.data });
            } else {
                toast.error(result.error || t('companyUpdateError'));
            }

        } catch (error) {
            toast.error(t('companyUpdateError'));
            console.error('Error updating company:', error);
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);

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
            <UploadPhoto
                register={register}
                setValue={setValue}
                type="logo"
                name="logo"
                label={t('uploadLogo')}
                hint={t('uploadLogoHint')}
                initialFiles={logo?.url ? [logo.url] : []}
                onRemoveImage={handleRemoveImage}
                onChange={(file) => {
                    handleImageChange(file);

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
                    <Controller
                        name="documentType"
                        control={control}
                        rules={{ required: t('documentType') + ' is required' }}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={value => {
                                    field.onChange(value);
                                    clearErrors(['document']);
                                    setValue('document', '');
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
                        )}
                    />
                    {errors.documentType && (
                        <p className="text-sm text-red-500 mt-1">{errors.documentType.message}</p>
                    )}
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
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 11) value = value.slice(0, 11);
                                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                                value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
                                value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
                                e.target.value = value;
                                setValue('document', value);
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
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 14) value = value.slice(0, 14);
                                value = value.replace(/(\d{2})(\d)/, '$1.$2');
                                value = value.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                                value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
                                value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
                                e.target.value = value;
                                setValue('document', value);
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

            <div className="flex justify-end gap-4 mt-8">
                {hasChanges ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="py-2 px-4 rounded-lg"
                        disabled={isSubmitting}
                    >
                        {t('reset')}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="py-2 px-4 rounded-lg"
                        disabled={isSubmitting}
                    >
                        {t('cancel')}
                    </Button>
                )}
                <Button
                    type="submit"
                    className="py-2 px-4 rounded-lg bg-blue-700 text-white font-semibold disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t('updating') : t('update')}
                </Button>
            </div>


            <div className="my-4 p-[1px] bg-gray-100 rounded-md">
            </div>

            <UserList
                ref={userListRef}
                disabled={isSubmitting}
                initialUsers={companyMembers?.map(member => ({
                    name: `${member?.user?.firstName} ${member?.user?.lastName}`,
                    email: member?.user?.email || '',
                    phone: member?.user?.phone || '',
                    avatar: member?.user?.avatar && 'url' in member.user.avatar ? member.user.avatar.url : '',
                    user: member.user,
                    documentId: member.documentId,
                    isAdmin: member.isAdmin || false,
                    canPost: member.canPost || false,
                    canApprove: member.canApprove || false,
                    isOwner: member.isOwner || false
                })) || []}
                onAddUser={handleAddCompanyMember}
                onEditUser={handleEditCompanyMember}
                onRemoveUser={handleRemoveCompanyMember}
            />

            <ConfirmDialog
                open={showResetConfirm}
                onConfirm={confirmReset}
                onCancel={() => setShowResetConfirm(false)}
                title={t('resetConfirmTitle')}
                description={t('resetConfirmDescription')}
                confirmLabel={t('resetConfirm')}
                cancelLabel={t('cancel')}
            />

            <ConfirmDialog
                open={showImageConfirm}
                onConfirm={confirmImageChange}
                onCancel={cancelImageChange}
                title={t('imageChangeConfirmTitle')}
                description={t('imageChangeConfirmDescription')}
                confirmLabel={t('confirm')}
                cancelLabel={t('cancel')}
            />
        </form>
    );
} 