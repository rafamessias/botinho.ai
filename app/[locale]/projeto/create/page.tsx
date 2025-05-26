import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { CreateProjectForm } from '@/components/project/create-project-form';

export default async function CreateProjectPage() {
    // Server-side data fetching
    const projects = await fetchContentApi('projects');

    return (
        <div className="max-w-[600px] mx-auto w-full px-6 py-12 bg-white rounded-lg shadow-md">
            <CreateProjectForm projects={projects} />
        </div>
    );
} 