import ContainerApp from '@/components/Container-app';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { Incident } from '@/components/types/strapi';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import IncidentEditForm from './incident-edit-form';

interface IncidentEditPageProps {
    params: Promise<{ slug: string; locale: string }>;
}

export default async function IncidentEditPage({ params }: IncidentEditPageProps) {
    const { slug, locale } = await params;
    const t = await getTranslations('incident');

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
    } catch (error) {
        console.error('Error fetching incident:', error);
    }

    if (!incident) {
        notFound();
    }

    return (
        <ContainerApp title={`${t('view.edit')} #${incident.id}`} showBackButton={true}>
            <IncidentEditForm incident={incident} />
        </ContainerApp>
    );
} 