import ContainerApp from "@/components/Container-app";
import { fetchContentApi } from "@/components/actions/fetch-content-api";
import { Project, ProjectUser } from "@/components/types/strapi";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProjectEditForm from "./project-edit-form";
import { RestrictProjectUsers } from "@/components/shared/restrict-project-users";

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

        // Fetch project users
        const projectUsersResponse = await fetchContentApi<ProjectUser[]>(`project-users?filters[project][id][$eq]=${project.id}&populate=*`, {
            next: {
                revalidate: 300,
                tags: [`project:users:${project.id}`]
            }
        });

        if (projectUsersResponse.success && projectUsersResponse.data) {
            project.users = projectUsersResponse.data;
        }

    } catch (error) {
        console.error(error);
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'project' });

    return (
        <RestrictProjectUsers>
            <ContainerApp title={project.name} showBackButton={true}>
                <ProjectEditForm project={project} />
            </ContainerApp>
        </RestrictProjectUsers>
    );
} 