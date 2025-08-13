'use client';
import { useForm } from 'react-hook-form';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { useRef, useState } from 'react';
import { createProject } from '@/components/actions/project-action';
import { Button } from '@/components/shared/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useLoading } from '@/components/LoadingProvider';

interface ProjectFormValues {
    projectName: string;
    projectDescription: string;
    projectAddress: string;
    projectPhoto?: FileList;
}

export function CreateProjectForm() {
    const t = useTranslations('project.create');
    const usersRef = useRef<UserListRef>(null);
    const { setIsLoading } = useLoading();
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
            const result = await createProject({
                name: projectData.projectName,
                description: projectData.projectDescription,
                address: projectData.projectAddress,
                projectPhoto: projectPhoto?.[0],
                users: users.map(user => ({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    canApprove: user.canApprove || false,
                }))
            });

            if (!result.success) {
                throw new Error(result.error || 'Failed to create project');
            }

            if (!result.data) {
                throw new Error('Project created but no data returned');
            }

            toast.success(t('success'));
            router.push(`/project/view/${result.data.id}`);

        } catch (error) {
            console.error('Failed to create project:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create project');
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

                <UserList
                    ref={usersRef}
                    showOwner={false}
                    showIsAdmin={false}
                    showCanPost={false}
                    showCanApprove={true}
                />

                <div className="flex justify-end gap-4 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                    >
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        onClick={handleSubmit(onSubmit)}
                    >
                        {t('buttons.create')}
                    </Button>
                </div>
            </form>
        </div>
    );
} 