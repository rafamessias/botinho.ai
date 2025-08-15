import React from 'react';
import ContainerApp from '@/components/Container-app';
import { Incident, RDO, Project, User } from '@/components/types/prisma';
import { getUserMe } from '@/components/actions/get-user-me-action';
import { getFeedData } from '@/components/actions/feed-actions';
import FeedWithInfiniteScroll from '@/components/feedPage/FeedWithInfiniteScroll';

export default async function FeedPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pageSize = Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) || 10;

    // TEMPORARY: Add delay to test loading skeleton
    //await new Promise(resolve => setTimeout(resolve, 300000)); // 3 second delay

    // Fetch user info
    let user: User | null = null;
    let project: Project | null = null;
    let rdos: RDO[] = [];
    let incidents: Incident[] = [];

    try {
        // Get user info
        const me = await getUserMe();
        if (me.success) user = me.data as User;

        // Fetch all feed data using Prisma
        const feedData = await getFeedData(parseInt(slug), pageSize);

        if (feedData.success && feedData.data) {
            project = feedData.data.project as unknown as Project;
            rdos = feedData.data.rdos as unknown as RDO[];
            incidents = feedData.data.incidents as unknown as Incident[];
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

