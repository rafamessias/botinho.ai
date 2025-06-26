import ContainerApp from "@/components/Container-app";
import { fetchContentApi } from "@/components/actions/fetch-content-api";
import { Project } from "@/components/types/strapi";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProjectEditForm from "./project-edit-form";

interface ProjectEditPageProps {
    params: Promise<{ slug: string; locale: string }>;
}

export default async function ProjectEditPage({ params }: ProjectEditPageProps) {
    const { slug, locale } = await params;

    let project: Project;

    try {
        // Fetch project data
        const projectResponse = await fetchContentApi<Project>(`projects/${slug}?populate=*`, {
            next: {
                revalidate: 300,
                tags: [`project:${slug}`]
            }
        });

        if (!projectResponse.success || !projectResponse.data) {
            notFound();
        }
        project = projectResponse.data;
    } catch (error) {
        console.error(error);
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'project' });

    return (
        <ContainerApp title={project.name} showBackButton={true}>
            <ProjectEditForm project={project} />
        </ContainerApp>
    );
} 