'use client';
import { useForm } from 'react-hook-form';
import { UploadPhoto } from './upload-photo';
import { OwnerList } from './owner-list';

interface ProjectFormValues {
    projectName: string;
    projectAddress: string;
}

export function CreateProjectForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
        defaultValues: {
            projectName: '',
            projectAddress: '',
        }
    });

    const onSubmit = (data: ProjectFormValues) => {
        // For now, just log the data
        console.log('Project Data:', data);
        alert('Projeto criado! (dummy)');
    };

    return (
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
            <UploadPhoto photoUrl="/placeholder-image.webp" />

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
                <label className="font-semibold text-base">Endereço do Projeto</label>
                <div className="text-xs text-muted-foreground mb-2">Adicione o endereço que será efetuado o projeto</div>
                <textarea
                    {...register('projectAddress', { required: 'O endereço do projeto é obrigatório' })}
                    className="w-full rounded-lg border px-3 py-2 text-sm  min-h-[100px]"
                    placeholder={"Avenida Paulista 4550\nSão Paulo\nCEP 09000-000"}
                />
                {errors.projectAddress && <span className="text-xs text-red-500">{errors.projectAddress.message}</span>}
            </div>

            <OwnerList />

            <div className="flex gap-4 mt-4">
                <button type="button" className="flex-1 py-2 rounded-lg border text-primary font-medium">Cancelar</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-primary text-white font-medium">Criar</button>
            </div>
        </form>
    );
} 