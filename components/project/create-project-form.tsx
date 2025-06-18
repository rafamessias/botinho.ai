'use client';
import { useForm } from 'react-hook-form';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { useRef, useState } from 'react';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { uploadFile } from '@/lib/strapi';
import { Button } from '@/components/shared/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface ProjectFormValues {
    projectName: string;
    projectDescription: string;
    projectAddress: string;
    projectPhoto?: FileList;
}

export function CreateProjectForm({ projects }: { projects: any }) {
    const t = useTranslations('project.create');
    const usersRef = useRef<UserListRef>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProjectFormValues>({
        defaultValues: {
            projectName: '',
            projectDescription: '',
            projectAddress: '',
        }
    });

    const onSubmit = async (data: ProjectFormValues) => {
        setIsLoading(true);
        const users = usersRef.current?.getUsers() || [];

        const { projectPhoto, ...projectData } = data;

        try {
            const newProjectResponse: any = await fetchContentApi('projects', {
                method: 'POST',
                body: {
                    data: {
                        name: projectData.projectName,
                        description: projectData.projectDescription,
                        address: projectData.projectAddress,
                    }
                }
            });

            if (!newProjectResponse) {
                throw new Error('Failed to create project');
            }

            const newProject = newProjectResponse.data;

            // Upload project photo if exists
            if (projectPhoto && projectPhoto[0]) {
                await uploadFile(
                    projectPhoto[0],
                    newProject.id,
                    'api::project.project',
                    'image'
                );
            }

            // Create project users for each owner
            for (const user of users) {
                await fetchContentApi('project-users', {
                    method: 'POST',
                    body: {
                        data: {
                            project: newProject.id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                        }
                    }
                });
            }

            toast.success(t('success'));
            router.push(`/project/${newProject.id}`);

        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <form id="obra-form" className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>

                <UploadPhoto
                    register={register}
                    setValue={setValue}
                    name="projectPhoto"
                    photoUrl="/placeholder-image.webp"
                    label={t('uploadPhoto.label')}
                    hint={t('uploadPhoto.hint')}
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

                <UserList ref={usersRef} />

                <div className="flex gap-4 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        fullWidth
                    >
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isLoading}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {t('buttons.create')}
                    </Button>
                </div>
            </form>
        </div>
    );
} 