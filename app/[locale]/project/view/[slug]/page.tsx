import ContainerApp from '@/components/Container-app';
import { prisma } from '@/prisma/lib/prisma';
import { notFound } from 'next/navigation';
import ProjectViewWithInfiniteScroll from './project-view-with-infinite-scroll';

export default async function ProjectViewPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug } = await params;
    const pageSize = Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) || 10;

    // TEMPORARY: Add delay to test loading skeleton
    //await new Promise(resolve => setTimeout(resolve, 300000)); // 3 second delay

    // Fetch project using Prisma
    const projectId = parseInt(slug);
    if (isNaN(projectId)) {
        notFound();
    }

    const projectData = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            image: true,
            company: {
                include: {
                    owner: true
                }
            }
        }
    });

    if (!projectData) {
        notFound();
    }

    // Fetch initial RDOs with pagination using Prisma
    const rdosData = await prisma.rDO.findMany({
        where: { projectId: projectId },
        include: {
            user: {
                include: {
                    avatar: true
                }
            },
            media: true
        },
        orderBy: [
            { date: 'desc' },
            { id: 'desc' }
        ],
        take: pageSize,
        skip: 0
    });


    // Fetch initial incidents with pagination using Prisma
    const incidentsData = await prisma.incident.findMany({
        where: { projectId: projectId },
        include: {
            user: {
                include: {
                    avatar: true
                }
            },
            media: true
        },
        orderBy: [
            { date: 'desc' },
            { id: 'desc' }
        ],
        take: pageSize,
        skip: 0
    });



    // Fetch project users using Prisma
    const projectUsersData = await prisma.projectUser.findMany({
        where: { projectId: projectId },
        include: {
            user: {
                include: {
                    avatar: true
                }
            },
            company: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });


    return (
        <ContainerApp title={projectData.name || ''} showBackButton={true}>
            <ProjectViewWithInfiniteScroll
                project={projectData}
                initialRdos={rdosData}
                initialIncidents={incidentsData}
                projectUsers={projectUsersData}
                projectSlug={slug}
            />
        </ContainerApp>
    );
}