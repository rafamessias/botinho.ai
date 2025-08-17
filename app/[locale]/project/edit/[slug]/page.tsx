
import { prismaWithCompany } from "@/components/actions/prisma-with-company";
import { notFound } from "next/navigation";
import ContainerApp from "@/components/Container-app";
import ProjectEditForm from "./project-edit-form";

// Force dynamic rendering since this page uses authentication
export const dynamic = 'force-dynamic';

export default async function ProjectEditPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;

    let projectData = null;

    try {
        // Fetch project data using Prisma
        const projectId = parseInt(slug);
        if (isNaN(projectId)) {
            notFound();
        }

        projectData = await prismaWithCompany.project.findUnique({
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

    return (
        <ContainerApp title={projectData.name || ''} showBackButton={true}>
            <ProjectEditForm project={projectData as any} />
        </ContainerApp>
    );
} 