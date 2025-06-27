import React from 'react';
import ContainerApp from '@/components/Container-app';
import FeedRDOCard from '@/components/feedPage/FeedRDOCard';
import FeedIncidentCard from '@/components/feedPage/FeedIncidentCard';
import { Incident, RDO, Project } from '@/components/types/strapi';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tabs } from '@/components/ui/tabs';

export default async function FeedPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const t = await getTranslations('feed');

    // Fetch project data first
    let project: Project | null = null;
    let rdos: RDO[] = [];
    let incidents: Incident[] = [];

    try {
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

        // Fetch RDOs
        const rdosResult = await fetchContentApi<RDO[]>(`rdos?populate=*&filters[project][$eq]=${slug}&sort=date:desc&sort=id:desc`, {
            next: {
                revalidate: 300,
                tags: [`rdos`]
            }
        });
        if (rdosResult.success && rdosResult.data) {
            rdos = rdosResult.data;
        }

        // Fetch incidents
        const incidentsResult = await fetchContentApi<Incident[]>(`incidents?populate=*&filters[project][$eq]=${slug}&sort=date:desc&sort=id:desc`, {
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

    const projectName = project?.name || '';
    const rdoCount = project?.rdoCount || rdos.length;
    const incidentCount = project?.incidentCount || incidents.length;

    return (
        <ContainerApp form={false} title={`${projectName}`} showBackButton={true}>
            <div className="max-w-[600px] mx-auto w-full">
                {/* Feed */}
                <div className="flex-1 overflow-y-auto pb-20 space-y-10">
                    <Tabs defaultValue="rdos" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="rdos">
                                {t('tabs.rdos')} <span className="ml-1 bg-gray-200 text-gray-600 rounded-full px-2 text-xs">{rdoCount}</span>
                            </TabsTrigger>
                            <TabsTrigger value="incidents">
                                {t('tabs.incidents')} <span className="ml-1 bg-gray-200 text-gray-600 rounded-full px-2 text-xs">{incidentCount}</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="rdos" className="space-y-10">
                            {rdos.length > 0 ? rdos.map((rdo) => (
                                <FeedRDOCard key={rdo.id} rdo={rdo} />
                            )) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="text-muted-foreground text-lg mb-2">{t('empty.title')}</div>
                                    <p className="text-sm text-muted-foreground/70 mb-4">{t('empty.description')}</p>
                                    <Link href={`/rdo/create?project=${slug}`}>
                                        <Button className="bg-primary hover:bg-primary/80">
                                            <Plus className="h-4 w-4 mr-2" />
                                            {t('empty.createButton')}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="incidents" className="space-y-10">
                            {incidents.length > 0 ? incidents.map((incident) => (
                                <FeedIncidentCard key={incident.id} incident={incident} />
                            )) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="text-muted-foreground text-lg mb-2">{t('incidents.empty.title')}</div>
                                    <p className="text-sm text-muted-foreground/70 mb-4">{t('incidents.empty.description')}</p>
                                    <Link href={`/incident/create?project=${slug}`}>
                                        <Button className="bg-primary hover:bg-primary/80">
                                            <Plus className="h-4 w-4 mr-2" />
                                            {t('incidents.empty.createButton')}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </ContainerApp>
    );
};

