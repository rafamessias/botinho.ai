import ContainerApp from '@/components/Container-app';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { Incident, Project, RDO, User } from '@/components/types/strapi';
import { notFound } from 'next/navigation';
import ProjectViewWithInfiniteScroll from './project-view-with-infinite-scroll';

export default async function ProjectViewPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug } = await params;
    const pageSize = Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) || 10;

    // TEMPORARY: Add delay to test loading skeleton
    //await new Promise(resolve => setTimeout(resolve, 300000)); // 3 second delay

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

    // Fetch initial RDOs with pagination
    const rdosResponse = await fetchContentApi<RDO[]>(`rdos?filters[project][documentId][$eq]=${slug}&populate[0]=user&populate[1]=media&sort[0]=date:desc&sort[1]=id:desc&pagination[page]=1&pagination[pageSize]=${pageSize}`, {
        next: {
            tags: [`project:rdos:${slug}`]
        }
    });

    const rdos = rdosResponse.success && rdosResponse.data ? rdosResponse.data : [];

    // Fetch initial incidents with pagination
    const incidentsResponse = await fetchContentApi<Incident[]>(`incidents?filters[project][documentId][$eq]=${slug}&populate[0]=user&populate[1]=media&sort[0]=date:desc&sort[1]=id:desc&pagination[page]=1&pagination[pageSize]=${pageSize}`, {
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
            <ProjectViewWithInfiniteScroll
                project={project}
                initialRdos={rdos}
                initialIncidents={incidents}
                projectUsers={projectUsers}
                projectSlug={slug}
            />
        </ContainerApp>
    );
}