import React from 'react';
import ContainerApp from '@/components/Container-app';
import { Incident, RDO, Project, ApiResponse, User } from '@/components/types/strapi';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { getUserMe } from '@/components/actions/get-user-me-action';
import FeedWithInfiniteScroll from '@/components/feedPage/FeedWithInfiniteScroll';

export default async function FeedPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pageSize = Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) || 10;

    // TEMPORARY: Add delay to test loading skeleton
    //await new Promise(resolve => setTimeout(resolve, 300000)); // 3 second delay

    // Fetch project data first
    let project: Project | null = null;
    let rdos: RDO[] = [];
    let incidents: Incident[] = [];
    let user: User | null = null;

    try {
        //get user info
        const me: ApiResponse<User> = await getUserMe();
        if (me.success) user = me.data as User;

        // Fetch project data
        const projectResult = await fetchContentApi<Project>(`projects/${slug}?populate=*`, {
            next: {
                revalidate: 300,
                tags: [`project:${slug}`]
            }
        });

        if (projectResult.success && projectResult.data) {
            project = projectResult.data;
        }

        // Fetch initial RDOs with pagination
        const rdosResult = await fetchContentApi<RDO[]>(`rdos?populate=*&filters[project][$eq]=${project?.id}&sort=date:desc&sort=id:desc&pagination[page]=1&pagination[pageSize]=${pageSize}`, {
            next: {
                revalidate: 300,
                tags: [`rdos`]
            }
        });
        if (rdosResult.success && rdosResult.data) {
            rdos = rdosResult.data;
        }

        // Fetch initial incidents with pagination
        const incidentsResult = await fetchContentApi<Incident[]>(`incidents?populate=*&filters[project][$eq]=${project?.id}&sort=date:desc&sort=id:desc&pagination[page]=1&pagination[pageSize]=${pageSize}`, {
            next: {
                revalidate: 300,
                tags: [`incidents`]
            }
        });
        if (incidentsResult.success && incidentsResult.data) {
            incidents = incidentsResult.data;
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }

    if (!project) {
        return (
            <ContainerApp
                form={false}
                title="Project not found"
                showBackButton={true}
                className="!px-0 sm:!px-8"
            >
                <div className="max-w-[616px] mx-auto w-full">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-muted-foreground text-lg mb-2">Project not found</div>
                    </div>
                </div>
            </ContainerApp>
        );
    }

    return (
        <ContainerApp
            form={false}
            title={`${project.name}`}
            showBackButton={true}
            editButton={`/project/edit/${slug}`}
            className="!px-0 sm:!px-8"
        >
            <FeedWithInfiniteScroll
                project={project}
                user={user}
                initialRdos={rdos}
                initialIncidents={incidents}
                projectSlug={slug}
            />
        </ContainerApp>
    );
};

