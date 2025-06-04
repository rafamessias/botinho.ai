'use client';
import { useForm } from 'react-hook-form';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { UserList, UserListRef } from '@/components/shared/user-list';
import { useRef, useState } from 'react';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { uploadFile } from '@/lib/strapi';
import { Button } from '@/components/shared/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProjectFormValues {
    projectName: string;
    projectDescription: string;
    projectAddress: string;
    projectPhoto?: FileList;
}

export function CreateProjectForm({ projects }: { projects: any }) {
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

            toast.success("Projeto criado com sucesso");
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
                <h2 className="text-2xl font-semibold mb-2">
                    Create Project
                </h2>
                <UploadPhoto
                    register={register}
                    setValue={setValue}
                    name="projectPhoto"
                    photoUrl="/placeholder-image.webp"
                    label="Subir Foto"
                    hint="Adicione uma foto (550px x 158px) para representar o Projeto"
                />

                <div>
                    <label className="font-semibold text-base">Nome Projeto</label>
                    <div className="text-xs text-muted-foreground mb-2">Qual seria o nome do Projeto</div>
                    <input
                        {...register('projectName', { required: 'O nome do projeto é obrigatório' })}
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                        placeholder="Ex.: Construção Casa João"
                    />
                    {errors.projectName && <span className="text-xs text-red-500">{errors.projectName.message}</span>}
                </div>

                <div>
                    <label className="font-semibold text-base">Descrição do Projeto</label>
                    <div className="text-xs text-muted-foreground mb-2">Adicione uma descrição detalhada do projeto</div>
                    <textarea
                        {...register('projectDescription', { required: 'A descrição do projeto é obrigatória' })}
                        className="w-full rounded-lg border px-3 py-2 text-sm min-h-[100px]"
                        placeholder="Descreva os detalhes do projeto..."
                    />
                    {errors.projectDescription && <span className="text-xs text-red-500">{errors.projectDescription.message}</span>}
                </div>

                <div>
                    <label className="font-semibold text-base">Endereço do Projeto</label>
                    <div className="text-xs text-muted-foreground mb-2">Adicione o endereço que será efetuado o projeto</div>
                    <textarea
                        {...register('projectAddress', { required: 'O endereço do projeto é obrigatório' })}
                        className="w-full rounded-lg border px-3 py-2 text-sm min-h-[100px]"
                        placeholder={"Avenida Paulista 4550\nSão Paulo\nCEP 09000-000"}
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
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isLoading}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Criar
                    </Button>
                </div>
            </form>
        </div>
    );
} 