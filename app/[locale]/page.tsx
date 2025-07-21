import ContainerApp from "@/components/Container-app"
import { getTranslations } from "next-intl/server"
import HomePage from "@/components/homePage/home-page"
import { fetchContentApi } from "@/components/actions/fetch-content-api"
import { Project } from "@/components/types/strapi"

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'homepage' });

    // TEMPORARY: Add delay to test loading skeleton
    //await new Promise(resolve => setTimeout(resolve, 300000)); // 3 second delay

    // Fetch active projects on the server side by default
    let projects: Project[] = [];
    try {
        const response = await fetchContentApi<Project[]>('projects?populate=*&filters[active][$eq]=true&sort=id:desc', {
            next: {
                revalidate: 300, // Cache for 5 minutes
                tags: ['projects']
            }
        });

        if (response.success && response.data) {
            // Serialize the data to ensure it's safe to pass to client components
            projects = JSON.parse(JSON.stringify(response.data));
        }
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        projects = [];
    }

    return (
        <ContainerApp form={false} title={t('home.projects')} showBackButton={false}>
            <HomePage initialProjects={projects} />
        </ContainerApp>
    );
} 