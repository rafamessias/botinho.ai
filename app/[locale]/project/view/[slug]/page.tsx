import ContainerApp from '@/components/Container-app';
import { getTranslations } from 'next-intl/server';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { Project } from '@/components/types/strapi';
import { notFound } from 'next/navigation';
import ProjectView from './project-view';

export default async function ProjectViewPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug } = await params;

    const projectResponse = await fetchContentApi<Project>(`projects/${slug}?populate=*`, {
        next: {
            tags: [`project:${slug}`]
        }
    });

    //console.log(projectResponse);

    if (!projectResponse.success || !projectResponse.data) {
        notFound();
    }
    const project = projectResponse.data;

    return (
        <ContainerApp title={project.name} showBackButton={true}>
            <ProjectView project={project} />
        </ContainerApp>
    );
}