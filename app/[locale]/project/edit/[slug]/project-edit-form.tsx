'use client';

import { useForm } from 'react-hook-form';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { useRef, useState, useEffect } from 'react';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { uploadFile } from '@/lib/strapi';
import { Button } from '@/components/shared/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Project, StrapiImage, ProjectUser } from '@/components/types/strapi';

interface ProjectFormValues {
    projectName: string;
    projectDescription: string;
    projectAddress: string;
    projectPhoto?: FileList;
}

export default function ProjectEditForm({ project }: { project: Project }) {
    const t = useTranslations('project.edit');
    const usersRef = useRef<UserListRef>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProjectFormValues>({
        defaultValues: {
            projectName: project.name || '',
            projectDescription: project.description || '',
            projectAddress: project.address || '',
        }
    });

    // Convert project users to the format expected by UserList
    const initialUsers = project.users ? project.users.map((user: ProjectUser) => ({
        name: user.name,
        email: user.email,
        phone: user.phone,
        documentId: user.documentId,
        isAdmin: false,
        canPost: false,
        canApprove: false,
        isOwner: false,
    })) : [];

    const onSubmit = async (data: ProjectFormValues) => {
        setIsLoading(true);
        const users = usersRef.current?.getUsers() || [];

        const { projectPhoto, ...projectData } = data;

        try {
            // Update project
            const updateProjectResponse: any = await fetchContentApi(`projects/${project.documentId}`, {
                method: 'PUT',
                body: {
                    data: {
                        name: projectData.projectName,
                        description: projectData.projectDescription,
                        address: projectData.projectAddress,
                    }
                },
                revalidateTag: [`project:${project.documentId}`, 'projects']
            });

            if (!updateProjectResponse.success) {
                throw new Error('Failed to update project');
            }

            // Upload project photo if exists
            if (projectPhoto && projectPhoto[0]) {
                await uploadFile(
                    projectPhoto[0],
                    project.id || 0,
                    'api::project.project',
                    'image'
                );
            }

            // Update project users
            // First, delete existing project users
            if (project.users) {
                for (const user of project.users) {
                    await fetchContentApi(`project-users/${user.id}`, {
                        method: 'DELETE',
                        revalidateTag: [`project:${project.documentId}`, 'projects']
                    });
                }
            }

            // Then create new project users
            for (const user of users) {
                await fetchContentApi('project-users', {
                    method: 'POST',
                    body: {
                        data: {
                            project: project.id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                        }
                    },
                    revalidateTag: [`project:${project.documentId}`, 'projects']
                });
            }

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

                <UserList ref={usersRef} initialUsers={initialUsers} />

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
                        isLoading={isLoading}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {t('buttons.update')}
                    </Button>
                </div>
            </form>
        </div>
    );
} 