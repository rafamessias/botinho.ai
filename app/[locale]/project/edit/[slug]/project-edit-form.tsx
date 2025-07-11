'use client';

import { useForm } from 'react-hook-form';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { useRef, useState } from 'react';
import { updateProject, uploadProjectAttachments, removeProjectAttachments, createProjectUser, updateProjectUser, removeProjectUser } from '@/components/actions/project-action';
import { Button } from '@/components/shared/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Project, StrapiImage, ProjectUser } from '@/components/types/strapi';
import { useLoading } from '@/components/LoadingProvider';
import { CompanyMemberDialog } from '@/components/types/strapi';

interface ProjectFormValues {
    projectName: string;
    projectDescription: string;
    projectAddress: string;
    projectPhoto?: string | FileList | File | StrapiImage;
    projectUsers?: ProjectUser[];
}

export default function ProjectEditForm({ project }: { project: Project }) {
    const t = useTranslations('project.edit');
    const usersRef = useRef<UserListRef>(null);
    const { setIsLoading } = useLoading();
    const [filesToBeRemoved, setFilesToBeRemoved] = useState<number[]>([]);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<ProjectFormValues>({
        defaultValues: {
            projectName: project.name || '',
            projectDescription: project.description || '',
            projectAddress: project.address || '',
            projectPhoto: project.image || {},
            projectUsers: project.users || [],
        }
    });

    // Convert project users to the format expected by UserList
    let initialUsers = project.users ? project.users.map((user: ProjectUser) => ({
        name: user.name,
        email: user.email,
        phone: user.phone,
        documentId: user.documentId,
        isAdmin: false,
        canPost: false,
        canApprove: user.canApprove || false,
        isOwner: false,
    })) : [];

    const handleAddProjectUser = async (user: CompanyMemberDialog) => {
        try {
            setIsLoading(true);
            const companyId = typeof project.company === 'number' ? project.company : project.company?.id;
            const response: any = await createProjectUser(project.id as number, project.name, {
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
                id: response.data?.id,
                documentId: response.data?.documentId
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
            console.log("editing project user", user);
            setIsLoading(true);
            const response: any = await updateProjectUser(project.id as number, user.documentId as string, {
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
                id: response.data?.id,
                documentId: response.data?.documentId
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
            if (user.documentId) {
                const response: any = await removeProjectUser(project.id as number, user.documentId as string);

                if (!response.success) {
                    console.error('Error removing project user:', response.error);
                    toast.error(t('userRemoveError'));
                    return false;
                }
            }
            console.log("user", user);
            initialUsers = initialUsers.filter((u: any) => u.email !== user.email);
            console.log("initialUsers", initialUsers);

            toast.success(t('userRemoved'));
            return true;
        } catch (error) {
            console.error('Error removing project user:', error);
            toast.error(t('userRemoveError'));
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ProjectFormValues) => {
        if (!project.documentId) {
            toast.error(t('error'));
            return;
        }

        setIsLoading(true);
        const { projectPhoto, ...projectData } = data;

        try {
            // Update project basic data
            const updateResponse = await updateProject(project.documentId, {
                name: projectData.projectName,
                description: projectData.projectDescription,
                address: projectData.projectAddress,
            });

            if (!updateResponse.success) {
                toast.error(updateResponse.error || t('error'));
                return;
            }

            // Handle file removals
            if (filesToBeRemoved.length > 0) {
                await removeProjectAttachments(filesToBeRemoved, project.documentId);
            }

            // Handle new file uploads
            /*
            if (projectPhoto && projectPhoto.length > 0 && project.id) {
                const filesToUpload = Array.from(projectPhoto).filter((file): file is File => file instanceof File);

                if (filesToUpload.length > 0) {
                    const uploadResponse = await uploadProjectAttachments(project.id, project.documentId, filesToUpload);

                    if (!uploadResponse.success) {
                        toast.error(uploadResponse.error || t('files.uploadError'));
                        // Continue with the process even if file upload fails
                    }
                }
            }
            */

            toast.success(t('success'));
            router.push(`/project/view/${project.documentId}`);

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

    const onRemoveImage = async (fileOrUrl: string | File | number) => {
        if (typeof fileOrUrl === 'number') {
            setFilesToBeRemoved([...filesToBeRemoved, fileOrUrl as number]);
        }
    };

    const onChange = (file: File | File[] | null) => {
        if (file) {
            // setValue('projectPhoto', file);
        }
    };

    return (
        <div className="relative">
            <form id="project-edit-form" className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>

                <UploadPhoto
                    register={register}
                    setValue={setValue}
                    name="projectPhoto"
                    photoUrl={(project.image as StrapiImage)?.url || "/placeholder-image.webp"}
                    label={t('uploadPhoto.label')}
                    hint={t('uploadPhoto.hint')}
                    currentImage={(project.image as StrapiImage)?.url}
                    initialFiles={project.image ? [project.image as StrapiImage] : []}
                    onRemoveImage={onRemoveImage}

                />

                <div>
                    <label className="font-semibold text-base">{t('name.label')}</label>
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