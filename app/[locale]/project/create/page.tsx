import ContainerApp from '@/components/Container-app';
import { CreateProjectForm } from '@/components/project/create-project-form';
import { getTranslations } from 'next-intl/server';

export default async function CreateProjectPage() {
    const t = await getTranslations('project');

    return (
        <ContainerApp title={t('create.title')} showBackButton={true}>
            <CreateProjectForm />
        </ContainerApp>
    );
} 