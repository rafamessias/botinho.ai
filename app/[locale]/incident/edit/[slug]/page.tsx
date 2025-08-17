import ContainerApp from '@/components/Container-app';
import { getIncidentById } from '@/components/actions/incident-action';
import { Incident } from '@/components/types/prisma';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import IncidentEditForm from './incident-edit-form';
import { RestrictProjectUsers } from '@/components/shared/restrict-project-users';

interface IncidentEditPageProps {
    params: Promise<{ slug: string; locale: string }>;
}

export default async function IncidentEditPage({ params }: IncidentEditPageProps) {
    const { slug, locale } = await params;
    const t = await getTranslations('incident');

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

        incident = incidentResponse.data;
    } catch (error) {
        console.error('Error fetching incident:', error);
        notFound();
    }

    if (!incident) {
        notFound();
    }

    return (
        <RestrictProjectUsers>
            <ContainerApp title={`${t('view.edit')} #${incident.id}`} showBackButton={true}>
                <IncidentEditForm incident={incident} />
            </ContainerApp>
        </RestrictProjectUsers>
    );
} 