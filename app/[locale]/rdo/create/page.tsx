import ContainerApp from "@/components/Container-app";
import CreateRDOForm from "./create-rdo-form";
import { fetchContentApi } from "@/components/actions/fetch-content-api";
import { Project } from "@/components/types/strapi";

export default async function CreateRDOPage({ searchParams }: { searchParams: Promise<{ project: string }> }) {
    const { project } = await searchParams;
    let selectedProject: Project | null = null;

    const projectsResponse = await fetchContentApi<Project[]>('projects');
    let projects: Project[] = [];
    if (projectsResponse.success && projectsResponse.data) {
        projects = projectsResponse.data;

        if (project) {
            selectedProject = projects.find(p => p.documentId === project) || null;
        }
    }

    return (
        <ContainerApp>
            <CreateRDOForm projects={projects} selectedProject={selectedProject} />
        </ContainerApp>
    );
} 