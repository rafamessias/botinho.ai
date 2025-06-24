'use client';

import { useForm, Controller } from 'react-hook-form';
import { ProjectSelect } from '@/components/rdo/form/ProjectSelect';
import { RDOStatusSelect } from '@/components/rdo/form/RDOStatusSelect';
import { RDODatePicker } from '@/components/rdo/form/RDODatePicker';
import { WeatherConditionGroup } from '@/components/rdo/form/WeatherConditionGroup';
import { DescriptionTextarea } from '@/components/rdo/form/DescriptionTextarea';
import { FileUploadBox } from '@/components/rdo/form/FileUploadBox';
import { EquipmentTextarea } from '@/components/rdo/form/EquipmentTextarea';
import { LaborTextarea } from '@/components/rdo/form/LaborTextarea';
import { FormActionButtons } from '@/components/rdo/form/FormActionButtons';
import { RDO, WeatherOption, RDOStatus, Project, StrapiImage } from '@/components/types/strapi';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { removeRdoAttachments, updateRDO, uploadRdoAttachments } from '@/components/actions/rdo-action';
import { toast } from 'sonner';
import { useLoading } from '@/components/LoadingProvider';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { useState } from 'react';

const rdoStatuses = [
    'draft',
    'pendingApproval',
    'Approved',
    'Rejected'
];

type FormData = {
    project: any;
    status: string;
    date: string;
    weather: WeatherOption;
    description: string;
    equipment: string;
    labor: string;
    files: File[];
};

export function RdoEditForm({ rdo }: { rdo: RDO }) {
    const router = useRouter();
    const t = useTranslations('formRDO');
    const { setIsLoading } = useLoading();
    const [filesToBeRemoved, setFilesToBeRemoved] = useState<number[]>([]);

    console.log(rdo);
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors }
    } = useForm<FormData>({
        defaultValues: {
            project: rdo.project,
            status: rdo.rdoStatus,
            date: new Date(rdo.date).toISOString(),
            weather: {
                weatherMorning: rdo.weatherMorning,
                weatherAfternoon: rdo.weatherAfternoon,
                weatherNight: rdo.weatherNight,
            },
            description: rdo.description || '',
            equipment: rdo.equipmentUsed || '',
            labor: rdo.workforce || '',
            files: [],
        },
        mode: 'onBlur',
    });

    const handleCancel = () => {
        router.back();
    };

    const onSubmit = async (data: FormData) => {

        if (!rdo.documentId) {
            toast.error(t('error'));
            return;
        }

        const rdoData = {
            description: data.description,
            equipmentUsed: data.equipment,
            workforce: data.labor,
            rdoStatus: data.status as RDOStatus,
            weatherMorning: data.weather.weatherMorning,
            weatherAfternoon: data.weather.weatherAfternoon,
            weatherNight: data.weather.weatherNight,
            date: new Date(data.date)
        }

        try {
            setIsLoading(true);
            console.log(rdoData);
            const response = await updateRDO(rdo.documentId, rdoData);
            console.log(response);
            if (response.success) {
                if (data.files && data.files.length > 0 && rdo.id) {
                    const filesToUpload = data.files.filter((file): file is File => file instanceof File);
                    if (filesToUpload.length === 0) {
                        toast.success(t('update.success'));
                        router.refresh();
                        return;
                    }
                    data.files = filesToUpload;
                    const uploadResponse = await uploadRdoAttachments(rdo.id, rdo.documentId as string, data.files);

                    if (!uploadResponse.success) {
                        toast.error(uploadResponse.error || t('files.uploadError'));
                        // Decide if we should stop here or continue
                    }
                }

                if (filesToBeRemoved.length > 0) {
                    await removeRdoAttachments(filesToBeRemoved, rdo.documentId as string);
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

    const onRemoveImage = async (fileOrUrl: string | File | number) => {
        setFilesToBeRemoved([...filesToBeRemoved, fileOrUrl as number]);
        console.log(fileOrUrl);
    };

    return (
        <form className="flex flex-col gap-4 mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-8">
                <Controller
                    name="project"
                    control={control}
                    rules={{ required: t('project.required') }}
                    render={({ field }) => (
                        <div>
                            <ProjectSelect
                                value={field.value}
                                onChange={field.onChange}
                                projects={[rdo.project as Project]}
                            />
                            {errors.project && (
                                <span className="text-red-500 text-xs mt-1">{errors.project.message as string}</span>
                            )}
                        </div>
                    )}
                />

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <RDOStatusSelect
                                value={field.value}
                                onChange={field.onChange}
                                statuses={rdoStatuses}
                            />
                        )}
                    />

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
                </div>

                <Controller
                    name="weather"
                    control={control}
                    render={({ field }) => (
                        <WeatherConditionGroup
                            weather={field.value}
                            setWeather={field.onChange}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    rules={{ required: t('description.required'), minLength: { value: 10, message: t('description.minLength') } }}
                    render={({ field }) => (
                        <div>
                            <DescriptionTextarea
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {errors.description && (
                                <span className="text-red-500 text-xs mt-1">{errors.description.message as string}</span>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name="files"
                    control={control}
                    render={({ field }) => (
                        <FileUploadBox
                            initialFiles={rdo.media as StrapiImage[] || []}
                            onFiles={field.onChange}
                            onRemoveImage={onRemoveImage}

                        />
                    )}
                />

                <Controller
                    name="equipment"
                    control={control}
                    render={({ field }) => (
                        <EquipmentTextarea
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name="labor"
                    control={control}
                    render={({ field }) => (
                        <LaborTextarea
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />

                <FormActionButtons
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                />
            </div>
        </form>
    );
}