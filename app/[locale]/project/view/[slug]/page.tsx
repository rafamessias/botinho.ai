import ContainerApp from '@/components/Container-app';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { Incident, Project, RDO, User } from '@/components/types/strapi';
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

    // Fetch RDOs for this project
    const rdosResponse = await fetchContentApi<RDO[]>(`rdos?filters[project][documentId][$eq]=${slug}&populate[0]=user&populate[1]=media&sort[0]=date:desc&sort[1]=id:desc`, {
        next: {
            tags: [`project:rdos:${slug}`]
        }
    });

    const rdos = rdosResponse.success && rdosResponse.data ? rdosResponse.data : [];

    // Fetch incidents for this project
    const incidentsResponse = await fetchContentApi<Incident[]>(`incidents?filters[project][documentId][$eq]=${slug}&populate[0]=user&populate[1]=media&sort[0]=date:desc&sort[1]=id:desc`, {
        next: {
            tags: [`project:incidents:${slug}`]
        }
    });

    const incidents = incidentsResponse.success && incidentsResponse.data ? incidentsResponse.data : [];

    // Fetch project users
    const usersResponse = await fetchContentApi<User[]>(`project-users?filters[project][documentId][$eq]=${slug}&populate[0]=user&sort[0]=createdAt:desc`, {
        next: {
            tags: [`project:users:${slug}`]
        }
    });

    const projectUsers = usersResponse.success && usersResponse.data ? usersResponse.data : [];

    return (
        <ContainerApp title={project.name} showBackButton={true}>
            <ProjectView project={project} rdos={rdos} incidents={incidents} projectUsers={projectUsers} />
        </ContainerApp>
    );
}