import ContainerApp from '@/components/Container-app';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { Incident } from '@/components/types/strapi';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import IncidentView from './incident-view';

interface IncidentViewPageProps {
    params: Promise<{ slug: string; locale: string }>;
}

export default async function IncidentViewPage({ params }: IncidentViewPageProps) {
    const { slug, locale } = await params;
    const t = await getTranslations('incident');

    // TEMPORARY: Add delay to test loading skeleton
    //await new Promise(resolve => setTimeout(resolve, 300000)); // 3 second delay

    let incident: Incident | null = null;

    try {
        // Fetch incident data
        const incidentResponse = await fetchContentApi<Incident>(`incidents/${slug}?populate=*`, {
            next: {
                revalidate: 300,
                tags: [`incident:${slug}`]
            }
        });

        if (!incidentResponse.success || !incidentResponse.data) {
            notFound();
        }

        incident = incidentResponse.data;


        const commentsFetch: any = await fetchContentApi<Comment[]>(`comments?populate=*&filters[incident][$eq]=${incident.id}&sort[0]=createdAt:desc`, {
            next: {
                revalidate: 300,
                tags: [`comments:${slug}`]
            }
        });
        const comments = commentsFetch.data || [];

        incident = {
            ...incident,
            comments
        };

    } catch (error) {
        console.error('Error fetching incident:', error);
    }

    if (!incident) {
        notFound();
    }

    return (
        <ContainerApp title={`${t('title')} #${incident.id}`} showBackButton={true} className="!px-0 sm:!px-8" divClassName="!rounded-none sm:!rounded-xl !shadow-none sm:!shadow-md border border-gray-100 sm:!border-none">
            <IncidentView incident={incident} />
        </ContainerApp>
    );
} 