import ContainerApp from "@/components/Container-app";
import CreateRDOForm from "./create-rdo-form";
import { fetchContentApi } from "@/components/actions/fetch-content-api";
import { Project } from "@/components/types/strapi";

export default async function CreateRDOPage() {
    // Server-side data fetching
    // Fetch projects from the Strapi API using fetchContentApi
    // (Assuming the endpoint is 'projects' and the function is imported elsewhere)
    // Example:
    const projectsResponse = await fetchContentApi<Project[]>('projects');

    let projects: Project[] = [];
    if (projectsResponse.success && projectsResponse.data) {
        projects = projectsResponse.data;
    }

    return (
        <ContainerApp>
            <CreateRDOForm projects={projects} />
        </ContainerApp>
    );
} 