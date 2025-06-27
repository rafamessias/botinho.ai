import ContainerApp from '@/components/Container-app';
import CreateIncidentForm from './create-incident-form';
import { getTranslations } from 'next-intl/server';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { Project } from '@/components/types/strapi';
import { EmptyState } from '@/components/shared/empty-state';

export default async function IncidentCreatePage({ searchParams }: { searchParams: Promise<{ locale: string }> }) {
    const { locale } = await searchParams;
    const t = await getTranslations({ locale, namespace: 'incident' });

    const projectsResponse = await fetchContentApi<Project[]>('projects?filters[projectStatus][$in][0]=active&filters[projectStatus][$in][1]=wip', {
        next: {
            revalidate: 300,
            tags: [`projects`]
        }
    });
    let projects: Project[] = [];
    if (projectsResponse.success && projectsResponse.data) {
        projects = projectsResponse.data;
    }

    // Show empty state if no projects are available
    if (projects.length === 0) {
        return (
            <ContainerApp title={t('title')} showBackButton={true}>
                <EmptyState
                    title={t('empty.title')}
                    description={t('empty.description')}
                    buttonLabel={t('empty.createButton')}
                    buttonHref="/project/create"
                />
            </ContainerApp>
        );
    }

    return (
        <ContainerApp title={t('title')} showBackButton={true}>
            <CreateIncidentForm projects={projects} />
        </ContainerApp>
    );
} 