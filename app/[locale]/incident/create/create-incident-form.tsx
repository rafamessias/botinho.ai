"use client";

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ProjectSelect } from '@/components/rdo/form/ProjectSelect';
import { RDODatePicker } from '@/components/rdo/form/RDODatePicker';
import { Project } from '@/components/types/prisma';
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
    date: string;
    description: string;
    media: File[] | null;
};

export default function CreateIncidentForm({ projects, project }: { projects: Project[], project: string }) {
    const router = useRouter();
    const t = useTranslations('incident');
    const { setIsLoading } = useLoading();

    const initialProject = project ? (projects.filter((p: Project) => p.id?.toString() === project)[0] || projects[0]) : projects[0];

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue,
        register,
    } = useForm<FormData>({
        defaultValues: {
            project: initialProject,
            incidentStatus: statusOptions[0],
            date: new Date().toISOString(),
            description: '',
            media: null,
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);

            // Transform form data to match CreateIncidentData interface
            const incidentData = {
                projectId: data.project.id!,
                date: new Date(data.date),
                incidentStatus: data.incidentStatus as any,
                description: data.description,
                media: data.media || undefined
            };

            const response = await createIncident(incidentData);

            if (response.success) {
                toast.success(t('success'));
                router.push(`/incident/view/${response.data?.id}`);
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

            {/* Date */}
            <Controller
                name="date"
                control={control}
                rules={{ required: t('date.required') }}
                render={({ field }) => (
                    <div>
                        <RDODatePicker
                            value={field.value}
                            onChange={field.onChange}
                        />
                        {errors.date && (
                            <span className="text-red-500 text-xs mt-1">{errors.date.message as string}</span>
                        )}
                    </div>
                )}
            />

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
                    onChange={(files) => {
                        if (files) {
                            setValue('media', Array.isArray(files) ? files : [files]);
                        }
                    }}
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