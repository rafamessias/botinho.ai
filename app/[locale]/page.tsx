import ContainerApp from "@/components/Container-app"
import { getTranslations } from "next-intl/server"
import HomePage from "@/components/homePage/home-page"
import { prisma } from "@/prisma/lib/prisma"
import { Project } from "@/components/types/prisma";


interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'homepage' });

    // TEMPORARY: Add delay to test loading skeleton
    //await new Promise(resolve => setTimeout(resolve, 300000)); // 3 second delay

    // Fetch active projects using Prisma
    let projectsData = null;
    try {
        projectsData = await prisma.project.findMany({
            where: {
                active: true
            },
            include: {
                image: true,
                company: {
                    include: {
                        owner: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

    } catch (error) {
        console.error('Failed to fetch projects:', error);
    }

    return (
        <ContainerApp form={false} title={t('home.projects')} showBackButton={false}>
            <HomePage initialProjects={projectsData as Project[] | null} />
        </ContainerApp>
    );
} 