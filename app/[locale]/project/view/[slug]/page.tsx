import ContainerApp from '@/components/Container-app';
import { prismaWithCompany } from '@/components/actions/prisma-with-company';
import { notFound } from 'next/navigation';
import ProjectViewWithInfiniteScroll from './project-view-with-infinite-scroll';

// Force dynamic rendering since this page uses authentication
export const dynamic = 'force-dynamic';

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

    const projectData = await prismaWithCompany.project.findUnique({
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
    const rdosData = await prismaWithCompany.rdo.findMany({
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
    const incidentsData = await prismaWithCompany.incident.findMany({
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
    const projectUsersData = await prismaWithCompany.projectUser.findMany({
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
                project={projectData as any}
                initialRdos={rdosData as any}
                initialIncidents={incidentsData as any}
                projectUsers={projectUsersData as any}
                projectSlug={slug}
            />
        </ContainerApp>
    );
}