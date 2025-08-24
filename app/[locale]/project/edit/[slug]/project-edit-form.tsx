'use client';

import { useForm } from 'react-hook-form';
import { EnhancedUploadPhoto } from '@/components/shared/enhanced-upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { useRef, useState } from 'react';
import { updateProject, removeProjectAttachments, createProjectUser, updateProjectUser, removeProjectUser } from '@/components/actions/project-action';
import { Button } from '@/components/shared/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { CompanyMemberDialog, FileImage } from '@/components/types/prisma';
import { ProjectStatus } from '@/lib/generated/prisma';
import { useLoading } from '@/components/LoadingProvider';
import { ProjectStatusCombobox } from '@/components/shared/project-status-combobox';
import { ProjectStatusBadge } from '@/components/shared/project-status-badge';
import { uploadToCloudinary } from '@/lib/client-upload';
import { createFileRecords } from '@/components/actions/client-upload-action';

// Type for Project with included relations
interface ProjectWithRelations {
    id: number;
    name: string | null;
    description: string | null;
    address: string | null;
    projectStatus: ProjectStatus;
    image: FileImage | null;
    company: {
        id: number;
        name: string | null;
        owner: any;
    } | null;
    users: Array<{
        id: number;
        name: string;
        email: string;
        phone: string;
        canApprove: boolean;
        user: any;
    }> | null;
}

interface ProjectFormValues {
    projectName: string;
    projectDescription: string;
    projectAddress: string;
    projectStatus: ProjectStatus;
    projectPhoto?: File[] | null;
    projectUsers?: any[];
}

export default function ProjectEditForm({ project }: { project: ProjectWithRelations }) {
    const t = useTranslations('project.edit');
    const usersRef = useRef<UserListRef>(null);
    const { setIsLoading } = useLoading();
    const [filesToBeRemoved, setFilesToBeRemoved] = useState<number[]>([]);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm<ProjectFormValues>({
        defaultValues: {
            projectName: project.name || '',
            projectDescription: project.description || '',
            projectAddress: project.address || '',
            projectStatus: project.projectStatus || 'active',
            projectPhoto: null,
            projectUsers: project.users || [],
        }
    });

    const currentStatus = watch('projectStatus');

    // Convert project users to the format expected by UserList
    let initialUsers = project.users ? project.users.map((user) => ({
        name: user.name,
        email: user.email,
        phone: user.phone,
        id: user.id,
        isAdmin: false,
        canPost: false,
        canApprove: user.canApprove || false,
        isOwner: false,
    })) : [];

    const handleAddProjectUser = async (user: CompanyMemberDialog) => {
        try {
            setIsLoading(true);
            const companyId = typeof project.company === 'number' ? project.company : project.company?.id;
            const response: any = await createProjectUser(project.id as number, project.name || '', {
                name: user.name,
                email: user.email,
                phone: user.phone,
                canApprove: user.canApprove,
                company: companyId
            });

            if (!response.success || !response.data) {
                console.error('Error adding project user:', response.error);
                toast.error(t('userAddError'));
                return false;
            }

            toast.success(t('userAdded'));

            // Return the updated user data
            return {
                ...user,
                id: response.data?.id
            };
        } catch (error) {
            console.error('Error adding project user:', error);
            toast.error(t('userAddError'));
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProjectUser = async (user: CompanyMemberDialog) => {
        try {

            setIsLoading(true);
            const response: any = await updateProjectUser(project.id as number, user.id as number, {
                name: user.name,
                email: user.email,
                phone: user.phone,
                canApprove: user.canApprove,
            });

            if (!response.success || !response.data) {
                console.error('Error updating project user:', response.error);
                toast.error(t('userUpdateError'));
                return false;
            }

            toast.success(t('userUpdated'));


            // Return the updated user data
            return {
                ...user,
                id: response.data?.id
            };
        } catch (error) {
            console.error('Error updating project user:', error);
            toast.error(t('userUpdateError'));
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveProjectUser = async (user: CompanyMemberDialog) => {
        try {
            setIsLoading(true);
            if (user.id) {
                const response: any = await removeProjectUser(project.id as number, user.id.toString());

                if (!response.success) {
                    console.error('Error removing project user:', response.error);
                    toast.error(t('userRemoveError'));
                    return false;
                }
            }

            toast.success(t('userRemoved'));
            return true;
        } catch (error) {
            console.error('Error removing project user:', error);
            toast.error(t('userRemoveError'));
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ProjectFormValues) => {
        if (!project.id) {
            toast.error(t('error'));
            return;
        }

        setIsLoading(true);
        const { projectPhoto, ...projectData } = data;

        try {
            // Update project basic data
            const updateResponse = await updateProject(project.id, {
                name: projectData.projectName,
                description: projectData.projectDescription,
                address: projectData.projectAddress,
                projectStatus: projectData.projectStatus,
            });

            if (!updateResponse.success) {
                toast.error(updateResponse.error || t('error'));
                return;
            }

            // Handle file removals
            if (filesToBeRemoved.length > 0) {
                await removeProjectAttachments(filesToBeRemoved, project.id);
            }

            // Handle new file uploads
            if (data.projectPhoto && data.projectPhoto.length > 0 && project.id) {
                const filesToUpload = data.projectPhoto.filter((file): file is File => file instanceof File);

                if (filesToUpload.length > 0) {
                    try {
                        // Upload files to Cloudinary
                        const uploadResults = await uploadToCloudinary(filesToUpload, 'obraguru/projects');

                        // Transform results to ClientUploadResult format
                        const clientUploadResults = uploadResults
                            .filter(result => result.success && result.data)
                            .map(result => result.data!);

                        // Create file records in database
                        const fileRecordsResponse = await createFileRecords({
                            uploadResults: clientUploadResults,
                            tableName: 'project',
                            recordId: project.id,
                            fieldName: 'image'
                        });

                        if (!fileRecordsResponse.success) {
                            toast.error(fileRecordsResponse.error || t('files.uploadError'));
                        }
                    } catch (error) {
                        console.error('Error uploading files:', error);
                        toast.error(t('files.uploadError'));
                    }
                }
            }

            toast.success(t('success'));
            router.push(`/project/view/${project.id}`);

        } catch (error) {
            console.error('Failed to update project:', error);
            toast.error(t('error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const onRemoveImage = async (fileOrUrl: string | File | FileImage | number) => {
        if (typeof fileOrUrl === 'number') {
            setFilesToBeRemoved([...filesToBeRemoved, fileOrUrl as number]);
        } else if ((fileOrUrl as FileImage)?.id) {
            // Handle FileImage objects with database IDs
            const fileId = (fileOrUrl as FileImage).id;
            if (fileId) {
                setFilesToBeRemoved([...filesToBeRemoved, fileId]);
            }
        }
    };

    const onChange = (files: File[] | null) => {
        if (files) {
            setValue('projectPhoto', files);
        }
    };

    return (
        <div className="relative">
            <form id="project-edit-form" className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>

                <EnhancedUploadPhoto
                    register={register}
                    setValue={setValue}
                    name="projectPhoto"
                    label={t('uploadPhoto.label')}
                    hint={t('uploadPhoto.hint')}
                    type="photo"
                    initialFiles={project.image ? [project.image as FileImage] : []}
                    onRemoveImage={onRemoveImage}
                    onChange={onChange}
                    maxFiles={1}
                    maxFileSize={50}
                />


                <div className="flex justify-between">
                    <div className="flex">
                        <ProjectStatusCombobox
                            value={currentStatus}
                            onChange={(value) => setValue('projectStatus', value)}
                            label={t('status.label')}
                            hint={t('status.hint')}
                            placeholder={t('status.placeholder')}
                        />
                    </div>
                    <div className="flex items-start justify-end">
                        <ProjectStatusBadge status={currentStatus} showIcon={false} />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between">
                        <label className="font-semibold text-base">{t('name.label')}</label>

                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{t('name.hint')}</div>

                    <input
                        {...register('projectName', { required: t('name.required') })}
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                        placeholder={t('name.placeholder')}
                    />
                    {errors.projectName && <span className="text-xs text-red-500">{errors.projectName.message}</span>}
                </div>

                <div>
                    <label className="font-semibold text-base">{t('description.label')}</label>
                    <div className="text-xs text-muted-foreground mb-2">{t('description.hint')}</div>
                    <textarea
                        {...register('projectDescription', { required: t('description.required') })}
                        className="w-full rounded-lg border px-3 py-2 text-sm min-h-[100px]"
                        placeholder={t('description.placeholder')}
                    />
                    {errors.projectDescription && <span className="text-xs text-red-500">{errors.projectDescription.message}</span>}
                </div>

                <div>
                    <label className="font-semibold text-base">{t('address.label')}</label>
                    <div className="text-xs text-muted-foreground mb-2">{t('address.hint')}</div>
                    <textarea
                        {...register('projectAddress', { required: t('address.required') })}
                        className="w-full rounded-lg border px-3 py-2 text-sm min-h-[100px]"
                        placeholder={t('address.placeholder')}
                    />
                    {errors.projectAddress && <span className="text-xs text-red-500">{errors.projectAddress.message}</span>}
                </div>

                <UserList
                    ref={usersRef}
                    initialUsers={initialUsers}
                    showOwner={false}
                    showIsAdmin={false}
                    showCanPost={false}
                    showCanApprove={true}
                    onAddUser={handleAddProjectUser}
                    onEditUser={handleEditProjectUser}
                    onRemoveUser={handleRemoveProjectUser}
                />

                <div className="flex justify-end gap-4 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"

                        onClick={handleSubmit(onSubmit)}
                    >
                        {t('buttons.update')}
                    </Button>
                </div>
            </form>
        </div>
    );
} 