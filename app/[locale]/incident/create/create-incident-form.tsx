"use client";
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProjectSelect } from '@/components/rdo/form/ProjectSelect';
import { Project } from '@/components/types/strapi';
import { UploadPhoto } from '@/components/shared/upload-photo';

const statusOptions = [
    'draft',
    'open',
    'wip',
    'closed'
];

type FormData = {
    project: number;
    status: string;
    description: string;
    files: File[];
};

export default function CreateIncidentForm({ projects }: { projects: Project[] }) {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const t = useTranslations('incident');

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue,
        register,
    } = useForm<FormData>({
        defaultValues: {
            project: projects.length > 0 ? projects[0].id : undefined,
            status: statusOptions[0],
            description: '',
            files: [],
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: FormData) => {
        // TODO: Implement incident creation logic
        toast.success(t('success'));
        // router.push('/');
    };

    const handleFileChange = (file: File | File[] | null) => {
        if (file) {
            const fileList = Array.isArray(file) ? file : [file];
            setFiles(fileList);
            setValue('files', fileList);
        }
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Projeto */}
            <Controller
                name="project"
                control={control}
                rules={{ required: 'Projeto obrigatório' }}
                render={({ field }) => (
                    <div>
                        <ProjectSelect
                            value={projects.find(p => p.id === field.value) || projects[0] || null}
                            onChange={(project) => field.onChange(project.id)}
                            projects={projects}
                        />
                        {errors.project && (
                            <span className="text-red-500 text-xs mt-1">{errors.project.message as string}</span>
                        )}
                    </div>
                )}
            />

            {/* Status da Ocorrência */}
            <div>
                <label className="block font-semibold mb-1">{t('status.label')}</label>
                <span className="block text-xs text-gray-400 mb-2">{t('status.hint')}</span>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue>{t(`status.${field.value}`)}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map(status => (
                                    <SelectItem key={status} value={status}>{t(`status.${status}`)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Descrição da Ocorrência */}
            <div>
                <label className="block font-semibold mb-1">{t('description.label')}</label>
                <span className="block text-xs text-gray-400 mb-2">{t('description.hint')}</span>
                <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'Descrição obrigatória' }}
                    render={({ field }) => (
                        <Textarea
                            className="min-h-[80px]"
                            placeholder="Divergência entre o projeto e a execução da piscina..."
                            {...field}
                        />
                    )}
                />
                {errors.description && (
                    <span className="text-red-500 text-xs mt-1">{errors.description.message as string}</span>
                )}
            </div>

            {/* Subir Fotos, Vídeos e documentos */}
            <div>
                <UploadPhoto
                    register={register}
                    setValue={setValue}
                    name="files"
                    label={t('files.label')}
                    hint={t('files.hint')}
                    type="carousel"
                    onChange={handleFileChange}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    {t('actions.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {t('actions.submit')}
                </Button>
            </div>
        </form>
    );
} 