'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ProjectSelect } from '@/components/rdo/form/ProjectSelect';
import { Project, Incident, StrapiImage } from '@/components/types/strapi';
import { UploadPhoto } from '@/components/shared/upload-photo';
import { useLoading } from '@/components/LoadingProvider';
import { updateIncident, uploadIncidentAttachments, removeIncidentAttachments } from '@/components/actions/incident-action';
import { useState } from 'react';

const statusOptions = [
    'draft',
    'open',
    'wip',
    'closed'
];


type FormData = {
    project: Project;
    incidentStatus: 'draft' | 'open' | 'wip' | 'closed';
    description: string;
    media: File[] | null;
};

export default function IncidentEditForm({ incident }: { incident: Incident }) {
    const router = useRouter();
    const t = useTranslations('incident');
    const { setIsLoading } = useLoading();
    const [filesToBeRemoved, setFilesToBeRemoved] = useState<number[]>([]);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue,
        register,
    } = useForm<FormData>({
        defaultValues: {
            project: incident.project as Project,
            incidentStatus: incident.incidentStatus,
            description: incident.description || '',
            media: null,
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: FormData) => {
        if (!incident.documentId) {
            toast.error(t('error'));
            return;
        }

        const incidentData = {
            incidentStatus: data.incidentStatus as 'draft' | 'open' | 'wip' | 'closed',
            description: data.description,
        };

        try {
            setIsLoading(true);
            const response = await updateIncident(incident.documentId, incidentData);

            if (response.success) {
                // Remove files if any
                if (filesToBeRemoved.length > 0) {
                    await removeIncidentAttachments(filesToBeRemoved, incident.documentId);
                }

                // Upload new files if any
                if (data.media && data.media.length > 0 && incident.id) {
                    const filesToUpload = data.media.filter((file): file is File => file instanceof File);
                    if (filesToUpload.length > 0) {
                        const uploadResponse = await uploadIncidentAttachments(incident.id, incident.documentId, filesToUpload);
                        if (!uploadResponse.success) {
                            toast.error(uploadResponse.error || t('files.uploadError'));
                        }
                    }
                }

                toast.success(t('update.success'));
                router.refresh();
            } else {
                toast.error(response.error || t('update.error'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(t('update.error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const onRemoveImage = async (fileOrUrl: string | File | number) => {
        if (typeof fileOrUrl === 'number') {
            setFilesToBeRemoved([...filesToBeRemoved, fileOrUrl]);
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
                            projects={[incident.project as Project]}
                        />
                        {errors.project && (
                            <span className="text-red-500 text-xs mt-1">{errors.project.message as string}</span>
                        )}
                    </div>
                )}
            />

            <div className="flex w-full gap-6">
                {/* Incident Status */}
                <div className="w-full">
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
                    initialFiles={incident.media as StrapiImage[] || []}
                    onRemoveImage={onRemoveImage}
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
                    {isSubmitting ? t('actions.updating') : t('actions.update')}
                </Button>
            </div>
        </form>
    );
} 