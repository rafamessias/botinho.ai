import ContainerApp from '@/components/Container-app';
import { getIncidentById } from '@/components/actions/incident-action';
import { Incident } from '@/components/types/prisma';
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
        // Parse the slug as incident ID
        const incidentId = parseInt(slug, 10);

        if (isNaN(incidentId)) {
            notFound();
        }

        // Fetch incident data using Prisma
        const incidentResponse = await getIncidentById(incidentId);

        if (!incidentResponse.success || !incidentResponse.data) {
            notFound();
        }

        // Transform the Prisma response to match the expected Strapi Incident type
        const prismaIncident = incidentResponse.data;

        // Use the Prisma incident data directly
        incident = prismaIncident;

    } catch (error) {
        console.error('Error fetching incident:', error);
        notFound();
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