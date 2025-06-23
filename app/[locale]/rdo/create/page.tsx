import ContainerApp from "@/components/Container-app";
import CreateRDOForm from "./create-rdo-form";
import { fetchContentApi } from "@/components/actions/fetch-content-api";
import { Project } from "@/components/types/strapi";
import { getTranslations } from "next-intl/server";
export default async function CreateRDOPage({ searchParams }: { searchParams: Promise<{ project: string, locale: string }> }) {
    const { project, locale } = await searchParams;
    let selectedProject: Project | null = null;

    const projectsResponse = await fetchContentApi<Project[]>('projects', {
        next: {
            revalidate: 300,
            tags: [`projects`]
        }
    });
    let projects: Project[] = [];
    if (projectsResponse.success && projectsResponse.data) {
        projects = projectsResponse.data;

        if (project) {
            selectedProject = projects.find(p => p.documentId === project) || null;
        }
    }

    const t = await getTranslations({ locale, namespace: 'rdo' });

    return (
        <ContainerApp title={t('title')} showBackButton={true}>
            <CreateRDOForm projects={projects} selectedProject={selectedProject} />
        </ContainerApp>
    );
} 