"use client";
import { useState } from 'react';
import { ProjectSelect } from '@/components/rdo/form/ProjectSelect';
import { RDOStatusSelect } from '@/components/rdo/form/RDOStatusSelect';
import { RDODatePicker } from '@/components/rdo/form/RDODatePicker';
import { WeatherConditionGroup } from '@/components/rdo/form/WeatherConditionGroup';
import { DescriptionTextarea } from '@/components/rdo/form/DescriptionTextarea';
import { FileUploadBox } from '@/components/rdo/form/FileUploadBox';
import { EquipmentTextarea } from '@/components/rdo/form/EquipmentTextarea';
import { LaborTextarea } from '@/components/rdo/form/LaborTextarea';
import { FormActionButtons } from '@/components/rdo/form/FormActionButtons';
import { Project } from '@/components/types/strapi';


const rdoStatuses = [
    { value: 'draft', label: 'Rascunho' },
];

export default function CreateRDOForm({ projects }: { projects: Project[] }) {
    const [selectedProject, setSelectedProject] = useState(projects[0]);
    const [rdoStatus, setRdoStatus] = useState(rdoStatuses[0].value);
    const [rdoDate, setRdoDate] = useState('');
    const [weather, setWeather] = useState({
        morning: { condition: 'clear', practicability: 'practicable' },
        afternoon: { condition: 'cloudy', practicability: 'practicable' },
        night: { condition: 'rainy', practicability: 'impracticable' },
    });
    const [description, setDescription] = useState('');
    const [equipment, setEquipment] = useState('');
    const [labor, setLabor] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCancel = () => {
        // Implement your cancel logic (e.g., router.back())
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Implement your submit logic
        setTimeout(() => setIsSubmitting(false), 1000);
    };

    return (
        <form className="flex flex-col gap-4 p-4 mx-auto" onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold">Postar RDO</h2>
            <ProjectSelect value={selectedProject} onChange={setSelectedProject} projects={projects} />
            <RDOStatusSelect value={rdoStatus} onChange={setRdoStatus} statuses={rdoStatuses} />
            <RDODatePicker value={rdoDate} onChange={setRdoDate} />
            <WeatherConditionGroup weather={weather} setWeather={setWeather} />
            <DescriptionTextarea value={description} onChange={setDescription} />
            <FileUploadBox onFiles={setFiles} />
            <EquipmentTextarea value={equipment} onChange={setEquipment} />
            <LaborTextarea value={labor} onChange={setLabor} />
            <FormActionButtons onCancel={handleCancel} isSubmitting={isSubmitting} />
        </form>
    );
}
