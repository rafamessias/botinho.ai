import ContainerApp from "@/components/Container-app";
import CreateRDOForm from "./create-rdo-form";
import { prisma } from "@/prisma/lib/prisma";
import { prismaWithCompany } from "@/components/actions/prisma-with-company";
import { Project } from "@/components/types/prisma";
import { Company, User } from "@/lib/generated/prisma";
import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/shared/empty-state";
import { RestrictProjectUsers } from "@/components/shared/restrict-project-users";
import { requireSession } from "@/components/actions/check-session";

export default async function CreateRDOPage({ searchParams }: { searchParams: Promise<{ project: string, locale: string }> }) {
    const { project, locale } = await searchParams;
    let selectedProject: Project | null = null;

    try {

        // Fetch projects using Prisma
        const projects = await prismaWithCompany.project.findMany({
            where: {
                projectStatus: {
                    in: ['active', 'wip']
                }
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

        // Find selected project if project parameter is provided
        if (project) {
            const projectId = parseInt(project);
            if (!isNaN(projectId)) {
                selectedProject = projects.find((p: any) => p.id === projectId) as any || null;
            }
        }

        const t = await getTranslations({ locale, namespace: 'rdo' });

        // Show empty state if no projects are available
        if (projects.length === 0) {
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
                    <CreateRDOForm projects={projects as any} selectedProject={selectedProject} />
                </ContainerApp>
            </RestrictProjectUsers>
        );
    } catch (error) {
        console.error('Error fetching projects:', error);

        const t = await getTranslations({ locale, namespace: 'rdo' });

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