import ContainerApp from "@/components/Container-app";
import { prisma } from "@/prisma/lib/prisma";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProjectEditForm from "./project-edit-form";
import { RestrictProjectUsers } from "@/components/shared/restrict-project-users";

interface ProjectEditPageProps {
    params: Promise<{ slug: string; locale: string }>;
}

export default async function ProjectEditPage({ params }: ProjectEditPageProps) {
    const { slug, locale } = await params;

    let projectData = null;

    try {
        // Fetch project data using Prisma
        const projectId = parseInt(slug);
        if (isNaN(projectId)) {
            notFound();
        }

        projectData = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                image: true,
                company: {
                    include: {
                        owner: true
                    }
                },
                users: {
                    include: {
                        user: {
                            include: {
                                avatar: true
                            }
                        }
                    }
                }
            }
        });

        if (!projectData) {
            notFound();
        }


    } catch (error) {
        console.error(error);
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'project' });

    return (
        <RestrictProjectUsers>
            <ContainerApp title={projectData.name || ''} showBackButton={true}>
                <ProjectEditForm project={projectData} />
            </ContainerApp>
        </RestrictProjectUsers>
    );
} 