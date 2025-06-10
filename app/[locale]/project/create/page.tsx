import { fetchContentApi } from '@/components/actions/fetch-content-api';
import ContainerApp from '@/components/Container-app';
import { CreateProjectForm } from '@/components/project/create-project-form';

export default async function CreateProjectPage() {
    // Server-side data fetching
    const projects = await fetchContentApi('projects');

    return (
        <ContainerApp>
            <CreateProjectForm projects={projects} />
        </ContainerApp>
    );
} 