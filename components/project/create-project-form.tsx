'use client';
import { useForm } from 'react-hook-form';
import { UploadPhoto } from './upload-photo';
import { OwnerList } from './owner-list';
import { client, uploadFile } from '@/lib/strapi';
import { useRef } from 'react';

interface ProjectFormValues {
    projectName: string;
    projectDescription: string;
    projectAddress: string;
    projectPhoto?: FileList;
}

interface Owner {
    name: string;
    email: string;
    phone: string;
}

export function CreateProjectForm() {
    const ownersRef = useRef<{ getOwners: () => Owner[] }>(null);

    let projects: any;
    try {
        projects = client.collection('projects')
    } catch (error) {
        console.error('Failed to fetch projects:', error);
    }

    const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
        defaultValues: {
            projectName: '',
            projectDescription: '',
            projectAddress: '',
        }
    });

    const onSubmit = async (data: ProjectFormValues) => {
        const owners = ownersRef.current?.getOwners() || [];
        console.log('Project Data:', { ...data, owners });

        const { projectPhoto, ...projectData } = data;

        try {
            const newProject = await projects.create({
                name: projectData.projectName,
                description: projectData.projectDescription,
                address: projectData.projectAddress,
            });
            console.log('Project created:', newProject);

            // Upload project photo if exists
            if (data.projectPhoto?.[0]) {
                await uploadFile(
                    data.projectPhoto[0],
                    newProject.id,
                    'api::project.project',
                    'image'
                );
            }

            // Create project users for each owner
            for (const owner of owners) {
                await client.collection('project-users').create({
                    project: newProject.id,
                    name: owner.name,
                    email: owner.email,
                    phone: owner.phone,
                });
            }

            console.log('Project created:', newProject);

        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    return (
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
            <UploadPhoto register={register} photoUrl="/placeholder-image.webp" />

            <div>
                <label className="font-semibold text-base">Nome Projeto</label>
                <div className="text-xs text-muted-foreground mb-2">Qual seria o nome do Projeto</div>
                <input
                    {...register('projectName', { required: 'O nome do projeto é obrigatório' })}
                    className="w-full rounded-lg border px-3 py-2 text-sm "
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
                    className="w-full rounded-lg border px-3 py-2 text-sm  min-h-[100px]"
                    placeholder={"Avenida Paulista 4550\nSão Paulo\nCEP 09000-000"}
                />
                {errors.projectAddress && <span className="text-xs text-red-500">{errors.projectAddress.message}</span>}
            </div>

            <OwnerList ref={ownersRef} />

            <div className="flex gap-4 mt-4">
                <button type="button" className="flex-1 py-2 rounded-lg border text-primary font-medium bg-white hover:bg-gray-100 border-gray-200" >Cancelar</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/80">Criar</button>
            </div>
        </form>
    );
} 