'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { EnhancedUploadPhoto } from '@/components/shared/enhanced-upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { Input } from '@/components/ui/input';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { updateCompany, createCompanyMember, updateCompanyMember, removeCompanyMember } from '@/components/actions/company-action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLoading } from '@/components/LoadingProvider';
import { useUser } from '../getUser';
import { Company, FileImage, CompanyMemberDialog } from '@/components/types/prisma';
import { Button } from '../shared/button';
import { ConfirmDialog } from '../shared/confirm-dialog';
import { Controller } from 'react-hook-form';
import { deleteFileFromCloudinary } from '@/components/actions/cloudinary-upload-action';
import { uploadToCloudinary } from '@/lib/client-upload';
import { createFileRecords } from '@/components/actions/client-upload-action';

function maskCPF(value: string) {
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function maskCNPJ(value: string) {
    return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function maskZipCode(value: string) {
    return value.replace(/^(\d{5})(\d{3})$/, "$1-$2");
}

type PendingLogoChange = {
    type: 'upload' | 'edit' | 'remove';
    file?: File;
    currentLogo?: FileImage;
};

export function EditCompanyForm({ company, companyMembers, locale }: { company: Company, companyMembers: CompanyMemberDialog[] | null, locale: string }) {
    const t = useTranslations('company');
    const router = useRouter();
    const { user, setUser } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [pendingLogoChange, setPendingLogoChange] = useState<PendingLogoChange | null>(null);
    const [uploadPhotoKey, setUploadPhotoKey] = useState(0);
    const [currentLogo, setCurrentLogo] = useState<FileImage | null>(company.logo as FileImage);
    const { setIsLoading } = useLoading();
    const userListRef = useRef<UserListRef>(null);

    const logo: FileImage = currentLogo as FileImage;

    const getInitialValues = () => ({
        name: company.name,
        documentType: company.documentType,
        document: company.documentType === 'cpf'
            ? maskCPF(company.document)
            : company.documentType === 'cnpj'
                ? maskCNPJ(company.document)
                : undefined,
        zipCode: maskZipCode(company.zipCode),
        state: company.state,
        city: company.city,
        address: company.address,
        logo: currentLogo,
        id: company.id
    });

    const initialValues = useMemo(() => getInitialValues(), [company]);

    const { register, handleSubmit, formState: { errors, isDirty }, setValue, getValues, clearErrors, reset, control, watch } = useForm<Company>({
        defaultValues: initialValues
    });
    const documentType = watch('documentType');

    // Get the current logo to display (either pending change or current)
    const getCurrentLogoForDisplay = () => {
        if ((pendingLogoChange?.type === 'upload' || pendingLogoChange?.type === 'edit') && pendingLogoChange.file) {
            // Return a temporary URL for the pending file
            return [URL.createObjectURL(pendingLogoChange.file)];
        } else if (pendingLogoChange?.type === 'remove') {
            // Return empty array for removal
            return [];
        } else {
            // Return current logo
            return logo?.url ? [logo.url] : [];
        }
    };

    // Track form changes
    useEffect(() => {
        const hasFormChanges = isDirty || pendingLogoChange !== null;
        setHasChanges((prev) => prev !== hasFormChanges ? hasFormChanges : prev);
    }, [isDirty, pendingLogoChange]);

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        reset(initialValues);
        setPendingLogoChange(null);
        setShowResetConfirm(false);
        // Force UploadPhoto component to re-render with original state
        setUploadPhotoKey(prev => prev + 1);
    };

    const resetPendingLogoChange = () => {
        setPendingLogoChange(null);
        // Reset form state to current logo
        setValue('logo', currentLogo);
        // Force UploadPhoto component to re-render with original state
        setUploadPhotoKey(prev => prev + 1);
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
                canApprove: user.canApprove,
                companyName: company.name,
                language: locale
            });

            if (!response.success || !response.data) {
                console.error('Error adding company member:', response.error);
                toast.error(`${t('memberAddError')} - ${t(response.error as string)}`);
                return false;
            }

            toast.success(t('memberAdded'));

            // Return the updated user data
            return {
                ...user,
                id: response.data.id,
                userId: response.data.id
            };
        } catch (error) {
            console.error('Error adding company member:', error);
            toast.error(`${t('memberAddError')} - ${t(error as string)}`);
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
                id: user.id,
                isAdmin: user.isAdmin,
                canPost: user.canPost,
                canApprove: user.canApprove
            });

            if (!response.success || !response.data) {
                console.error('Error updating company member:', response.error);
                toast.error(`${t('memberUpdateError')} - ${response.error}`);
                return false;
            }

            toast.success(t('memberUpdated'));

            // Return the updated user data
            return {
                ...user,
                id: response.data.id
            };
        } catch (error) {
            console.error('Error updating company member:', error);
            toast.error(`${t('memberUpdateError')} - ${error}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveCompanyMember = async (user: CompanyMemberDialog) => {
        try {
            setIsLoading(true);
            const response = await removeCompanyMember(user.id as number, user.user?.id as number);

            if (!response.success) {
                console.error('Error removing company member:', response.error);
                toast.error(`${t('memberRemoveError')} - ${response.error}`);
                return false;
            }

            toast.success(t('memberRemoved'));
            return true;
        } catch (error) {
            console.error('Error removing company member:', error);
            toast.error(`${t('memberRemoveError')} - ${error}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoChange = (file: File | File[] | null) => {
        if (file) {
            const fileList = Array.isArray(file) ? file : [file];
            // For single file uploads (like logo), we expect only one file
            const newFile = fileList[0];

            // Determine if this is an edit (replacing existing logo) or upload (no existing logo)
            const changeType = currentLogo ? 'edit' : 'upload';

            setPendingLogoChange({
                type: changeType,
                file: newFile,
                currentLogo: currentLogo || undefined
            });
        } else {
            setPendingLogoChange({
                type: 'remove',
                currentLogo: currentLogo || undefined
            });
        }
    };

    const handleRemoveLogo = () => {
        setPendingLogoChange({
            type: 'remove',
            currentLogo: logo
        });
    };

    const onSubmit = async (data: Company) => {
        try {
            setIsSubmitting(true);
            setIsLoading(true);

            // Handle pending logo changes first
            if (pendingLogoChange) {
                if ((pendingLogoChange.type === 'upload' || pendingLogoChange.type === 'edit') && pendingLogoChange.file) {
                    // For edit type, delete old logo first
                    if (pendingLogoChange.type === 'edit' && pendingLogoChange.currentLogo?.id) {
                        await deleteFileFromCloudinary(pendingLogoChange.currentLogo.id);
                    }

                    // Upload new logo to Cloudinary
                    const uploadResults = await uploadToCloudinary([pendingLogoChange.file], 'obraguru/companies');

                    // Transform results to ClientUploadResult format
                    const clientUploadResults = uploadResults
                        .filter(result => result.success && result.data)
                        .map(result => result.data!);

                    if (clientUploadResults.length === 0) {
                        throw new Error('Failed to upload logo');
                    }

                    // Create file record in database
                    const fileRecordsResponse = await createFileRecords({
                        uploadResults: clientUploadResults,
                        tableName: 'company',
                        recordId: company.id!,
                        fieldName: 'logoId'
                    });

                    if (!fileRecordsResponse.success) {
                        throw new Error(fileRecordsResponse.error || 'Failed to create file record');
                    }

                    // Update form data with the uploaded file
                    const uploadedFile = fileRecordsResponse.data?.[0];
                    if (uploadedFile) {
                        data.logo = uploadedFile as FileImage;
                    }
                } else if (pendingLogoChange.type === 'remove') {
                    // Delete current logo if exists
                    if (pendingLogoChange.currentLogo?.id) {
                        await deleteFileFromCloudinary(pendingLogoChange.currentLogo.id);
                    }
                    data.logo = null;
                }
            }

            // Remove masking from cpf, cnpj, and zipcode
            const cleanData = {
                ...data,
                document: data.document ? data.document.replace(/\D/g, '') : undefined,
                zipCode: data.zipCode.replace(/\D/g, '')
            };

            const result = await updateCompany(cleanData);

            if (result.success) {
                toast.success(t('companyUpdated'));
                setUser({ ...user, company: result.data as any, email: user?.email || '' } as any);

                // Clear pending logo change
                setPendingLogoChange(null);

                // Force re-render of the upload component with new data
                setUploadPhotoKey(prev => prev + 1);

                // Reset form with updated data from the result
                const updatedCompany = result.data as any;
                const updatedInitialValues = {
                    name: updatedCompany.name,
                    documentType: updatedCompany.documentType,
                    document: updatedCompany.documentType === 'cpf'
                        ? maskCPF(updatedCompany.document)
                        : updatedCompany.documentType === 'cnpj'
                            ? maskCNPJ(updatedCompany.document)
                            : undefined,
                    zipCode: maskZipCode(updatedCompany.zipCode),
                    state: updatedCompany.state,
                    city: updatedCompany.city,
                    address: updatedCompany.address,
                    logo: updatedCompany.logo,
                    id: updatedCompany.id
                };
                reset(updatedInitialValues);

                // Update the current logo state to reflect the changes
                // This ensures getCurrentLogoForDisplay() shows the correct logo
                setCurrentLogo(updatedCompany.logo);
            } else {
                toast.error(result.error || t('companyUpdateError'));
            }

        } catch (error) {
            toast.error(`${t('companyUpdateError')} - ${error}`);
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
            <EnhancedUploadPhoto
                register={register}
                setValue={setValue}
                type="logo"
                name="logo"
                label={t('uploadLogo')}
                hint={t('uploadLogoHint')}
                initialFiles={getCurrentLogoForDisplay()}
                onRemoveImage={handleRemoveLogo}
                onChange={handleLogoChange}
                maxFiles={1}
                maxFileSize={10}
                key={uploadPhotoKey} // Add key to force re-render
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
                                    <SelectItem value="cpf">{t('cpf')}</SelectItem>
                                    <SelectItem value="cnpj">{t('cnpj')}</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.documentType && (
                        <p className="text-sm text-red-500 mt-1">{errors.documentType.message}</p>
                    )}
                </div>
                {documentType === 'cpf' && (
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
                {documentType === 'cnpj' && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold">{t('activeProjectCount') || 'Active Projects'}</label>
                    <div className="mt-1 px-3 py-2 text-sm bg-gray-50 border rounded-md text-gray-700">
                        {company.activeProjectCount || 0}
                    </div>
                </div>
                <div>
                    <label className="font-semibold">{t('projectCount') || 'Total Projects'}</label>
                    <div className="mt-1 px-3 py-2 text-sm bg-gray-50 border rounded-md text-gray-700">
                        {company.projectCount || 0}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
                {hasChanges ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="px-4 rounded-lg"
                        disabled={isSubmitting}
                    >
                        {t('reset')}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="px-4 rounded-lg"
                        disabled={isSubmitting}
                    >
                        {t('cancel')}
                    </Button>
                )}
                <Button
                    type="submit"
                    className="px-4 rounded-lg bg-blue-700 text-white font-semibold disabled:opacity-50"
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
                    id: member.id,
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


        </form>
    );
} 