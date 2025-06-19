import ContainerApp from '@/components/Container-app';
import CreateIncidentForm from './create-incident-form';
import { getTranslations } from 'next-intl/server';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { Project } from '@/components/types/strapi';

export default async function IncidentCreatePage({ searchParams }: { searchParams: Promise<{ locale: string }> }) {
    const { locale } = await searchParams;
    const t = await getTranslations({ locale, namespace: 'incident' });

    const projectsResponse = await fetchContentApi<Project[]>('projects');
    let projects: Project[] = [];
    if (projectsResponse.success && projectsResponse.data) {
        projects = projectsResponse.data;
    }


    return (
        <ContainerApp title={t('title')} showBackButton={true}>
            <CreateIncidentForm projects={projects} />
        </ContainerApp>
    );
} 