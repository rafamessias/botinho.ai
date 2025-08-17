import ContainerApp from "@/components/Container-app";
import CreateIncidentForm from "./create-incident-form";
import { prisma } from '@/prisma/lib/prisma';
import { prismaWithCompany } from '@/components/actions/prisma-with-company';
import { Project } from "@/components/types/prisma";
import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/shared/empty-state";
import { RestrictProjectUsers } from "@/components/shared/restrict-project-users";
import { requireSession } from '@/components/actions/check-session';
import { getUserMe } from '@/components/actions/get-user-me-action';

// Force dynamic rendering since this page uses authentication
export const dynamic = 'force-dynamic';

export default async function CreateIncidentPage({ searchParams }: { searchParams: Promise<{ project: string, locale: string }> }) {
    const { locale, project } = await searchParams;
    const t = await getTranslations({ locale, namespace: 'incident' });

    try {
        // Check authentication
        await requireSession();

        // Get current user with company info
        const userMeResponse = await getUserMe();
        if (!userMeResponse.success || !userMeResponse.data?.company?.id) {
            return (
                <RestrictProjectUsers>
                    <ContainerApp title={t('title')} showBackButton={true}>
                        <EmptyState
                            title={t('empty.title')}
                            description={t('empty.description')}
                            buttonLabel={t('empty.createButton')}
                            buttonHref="/project/create"
                        />
                    </ContainerApp>
                </RestrictProjectUsers>
            );
        }

        // Fetch projects using Prisma
        const projects = await prismaWithCompany.project.findMany({
            where: {
                projectStatus: {
                    in: ['active', 'wip']
                },
                active: true
            },
            include: {
                image: true,
                company: {
                    include: {
                        owner: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        // Transform projects to match expected format
        const transformedProjects: Project[] = projects.map((project: any) => ({
            id: project.id,
            name: project.name,
            description: project.description || '',
            address: project.address || '',
            projectStatus: project.projectStatus,
            rdoCount: project.rdoCount,
            rdoCountDraft: project.rdoCountDraft,
            incidentCount: project.incidentCount,
            incidentCountDraft: project.incidentCountDraft,
            photoCount: project.photoCount,
            active: project.active,
            image: project.image,
            company: project.company,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
        }));

        // Show empty state if no projects are available
        if (transformedProjects.length === 0) {
            return (
                <RestrictProjectUsers>
                    <ContainerApp title={t('title')} showBackButton={true}>
                        <EmptyState
                            title={t('empty.title')}
                            description={t('empty.description')}
                            buttonLabel={t('empty.createButton')}
                            buttonHref="/project/create"
                        />
                    </ContainerApp>
                </RestrictProjectUsers>
            );
        }

        return (
            <RestrictProjectUsers>
                <ContainerApp title={t('title')} showBackButton={true}>
                    <CreateIncidentForm projects={transformedProjects} project={project} />
                </ContainerApp>
            </RestrictProjectUsers>
        );
    } catch (error) {
        console.error('Error fetching projects:', error);
        return (
            <RestrictProjectUsers>
                <ContainerApp title={t('title')} showBackButton={true}>
                    <EmptyState
                        title={t('empty.title')}
                        description={t('empty.description')}
                        buttonLabel={t('empty.createButton')}
                        buttonHref="/project/create"
                    />
                </ContainerApp>
            </RestrictProjectUsers>
        );
    }
} 