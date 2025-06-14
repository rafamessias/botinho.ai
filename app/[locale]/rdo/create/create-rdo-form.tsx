"use client";
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
import { Project, WeatherOption } from '@/components/types/strapi';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const rdoStatuses = [
    { value: 'draft', label: 'Rascunho' },
];

type FormData = {
    project: Project;
    status: string;
    date: string;
    weather: WeatherOption;
    description: string;
    equipment: string;
    labor: string;
    files: File[];
};

export default function CreateRDOForm({ projects }: { projects: Project[] }) {
    const router = useRouter();
    const t = useTranslations('form');
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors }
    } = useForm<FormData>({
        defaultValues: {
            project: projects[0],
            status: rdoStatuses[0].value,
            date: '',
            weather: {
                wheatherMorning: { condition: null, workable: true },
                wheatherAfternoon: { condition: null, workable: true },
                wheatherNight: { condition: null, workable: true },
            },
            description: '',
            equipment: '',
            labor: '',
            files: [],
        }
    });

    const handleCancel = () => {
        router.back();
    };

    const onSubmit = async (data: FormData) => {
        try {
            console.log('Form data:', data);
            // Implement your submit logic here
            // await createRDO(data);
            //router.push('/rdo'); // Redirect after successful submission
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form className="flex flex-col gap-4 mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-bold">{t('title')}</h2>

            <div className="flex flex-col gap-8">
                <Controller
                    name="project"
                    control={control}
                    render={({ field }) => (
                        <ProjectSelect
                            value={field.value}
                            onChange={field.onChange}
                            projects={projects}
                        />
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
                        render={({ field }) => (
                            <RDODatePicker
                                value={field.value}
                                onChange={field.onChange}
                            />
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
                    render={({ field }) => (
                        <DescriptionTextarea
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name="files"
                    control={control}
                    render={({ field }) => (
                        <FileUploadBox
                            onFiles={field.onChange}
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
