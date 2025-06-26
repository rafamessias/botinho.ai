"use client";

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ProjectSelect } from '@/components/rdo/form/ProjectSelect';
import { Project } from '@/components/types/strapi';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { useLoading } from '@/components/LoadingProvider';
import { createIncident } from '@/components/actions/incident-action';

const statusOptions = [
    'draft',
    'open',
    'wip',
    'closed'
];

type FormData = {
    project: Project;
    incidentStatus: string;
    description: string;
    media: FileList | null;
};

export default function CreateIncidentForm({ projects }: { projects: Project[] }) {
    const router = useRouter();
    const t = useTranslations('incident');
    const { setIsLoading } = useLoading();

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue,
        register,
    } = useForm<FormData>({
        defaultValues: {
            project: projects.length > 0 ? projects[0] : undefined,
            incidentStatus: statusOptions[0],
            description: '',
            media: null,
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);

            const response = await createIncident(data as any);

            if (response.success) {
                toast.success(t('success'));
                router.push(`/incident/view/${response.data?.documentId}`);
            } else {
                toast.error(response.error || t('error'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(t('error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const handleFileChange = (file: File | File[] | null) => {
        if (file) {
            if (Array.isArray(file)) {
                // Convert File[] to FileList
                const dataTransfer = new DataTransfer();
                file.forEach(f => dataTransfer.items.add(f));
                setValue('media', dataTransfer.files);
            } else {
                // Convert single File to FileList
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                setValue('media', dataTransfer.files);
            }
        } else {
            setValue('media', null);
        }
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Project */}
            <Controller
                name="project"
                control={control}
                rules={{ required: t('project.required') }}
                render={({ field }) => (
                    <div>
                        <ProjectSelect
                            value={field.value}
                            onChange={field.onChange}
                            projects={projects}
                        />
                        {errors.project && (
                            <span className="text-red-500 text-xs mt-1">{errors.project.message as string}</span>
                        )}
                    </div>
                )}
            />

            {/* Incident Status */}
            <div>
                <label className="block font-semibold mb-1">{t('status.label')}</label>
                <span className="block text-xs text-gray-400 mb-2">{t('status.hint')}</span>
                <Controller
                    name="incidentStatus"
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

            {/* Incident Description */}
            <div>
                <label className="block font-semibold mb-1">{t('description.label')}</label>
                <span className="block text-xs text-gray-400 mb-2">{t('description.hint')}</span>
                <Controller
                    name="description"
                    control={control}
                    rules={{ required: t('description.required') }}
                    render={({ field }) => (
                        <Textarea
                            className="min-h-[80px]"
                            placeholder={t('description.placeholder')}
                            {...field}
                        />
                    )}
                />
                {errors.description && (
                    <span className="text-red-500 text-xs mt-1">{errors.description.message as string}</span>
                )}
            </div>

            {/* Upload Photos, Videos and Documents */}
            <div>
                <UploadPhoto
                    register={register}
                    setValue={setValue}
                    name="media"
                    label={t('files.label')}
                    hint={t('files.hint')}
                    type="carousel"
                    onChange={handleFileChange}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                    {t('actions.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {t('actions.submit')}
                </Button>
            </div>
        </form>
    );
} 