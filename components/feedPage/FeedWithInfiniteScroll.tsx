"use client"

import React, { useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedRDOCard from './FeedRDOCard';
import FeedIncidentCard from './FeedIncidentCard';
import { Incident, RDO, Project, User } from '@/components/types/strapi';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tabs } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { getPaginatedRdos, getPaginatedIncidents } from '@/components/actions/feed-actions';

interface FeedWithInfiniteScrollProps {
    project: Project;
    user: User | null;
    initialRdos: RDO[];
    initialIncidents: Incident[];
    projectSlug: string;
}

const ITEMS_PER_PAGE = Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) || 10;
console.log(ITEMS_PER_PAGE)

export default function FeedWithInfiniteScroll({
    project,
    user,
    initialRdos,
    initialIncidents,
    projectSlug
}: FeedWithInfiniteScrollProps) {
    const t = useTranslations('feed');
    const [activeTab, setActiveTab] = useState('rdos');

    // RDOs state
    const [rdos, setRdos] = useState<RDO[]>(initialRdos);
    const [rdosHasMore, setRdosHasMore] = useState(initialRdos.length >= ITEMS_PER_PAGE);
    const [rdosPage, setRdosPage] = useState(1);
    const [rdosLoading, setRdosLoading] = useState(false);

    // Incidents state
    const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
    const [incidentsHasMore, setIncidentsHasMore] = useState(initialIncidents.length >= ITEMS_PER_PAGE);
    const [incidentsPage, setIncidentsPage] = useState(1);
    const [incidentsLoading, setIncidentsLoading] = useState(false);

    const rdoCount = () => {
        if (user?.companyMember) {
            return Number(project?.rdoCount || 0) + Number(project?.rdoCountDraft || 0);
        }
        return Number(project?.rdoCount || 0);
    }

    const incidentCount = () => {
        if (user?.companyMember) {
            return Number(project?.incidentCount || 0) + Number(project?.incidentCountDraft || 0);
        }
        return Number(project?.incidentCount || 0);
    }

    const fetchMoreRdos = useCallback(async () => {
        if (rdosLoading || !rdosHasMore || !project.id) return;

        setRdosLoading(true);
        try {
            const nextPage = rdosPage + 1;
            const response = await getPaginatedRdos(project.id, nextPage, ITEMS_PER_PAGE);

            if (response.success && response.data) {
                setRdos(prev => [...prev, ...response.data!]);
                setRdosPage(nextPage);
                setRdosHasMore(response.data.length === ITEMS_PER_PAGE);
            }
        } catch (error) {
            console.error('Error fetching more RDOs:', error);
        } finally {
            setRdosLoading(false);
        }
    }, [rdosLoading, rdosHasMore, rdosPage, project.id]);

    const fetchMoreIncidents = useCallback(async () => {
        if (incidentsLoading || !incidentsHasMore || !project.id) return;

        setIncidentsLoading(true);
        try {
            const nextPage = incidentsPage + 1;
            const response = await getPaginatedIncidents(project.id, nextPage, ITEMS_PER_PAGE);

            if (response.success && response.data) {
                setIncidents(prev => [...prev, ...response.data!]);
                setIncidentsPage(nextPage);
                setIncidentsHasMore(response.data.length === ITEMS_PER_PAGE);
            }
        } catch (error) {
            console.error('Error fetching more incidents:', error);
        } finally {
            setIncidentsLoading(false);
        }
    }, [incidentsLoading, incidentsHasMore, incidentsPage, project.id]);

    return (
        <div className="max-w-[616px] mx-auto w-full">
            <div className="flex-1 pb-20 sm:px-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 !rounded-none sm:!rounded-lg !px-4 sm:!px-1">
                        <TabsTrigger value="rdos">
                            {t('tabs.rdos')} <span className="ml-1 bg-gray-200 text-gray-600 rounded-full px-2 text-xs">{rdoCount()}</span>
                        </TabsTrigger>
                        <TabsTrigger value="incidents">
                            {t('tabs.incidents')} <span className="ml-1 bg-gray-200 text-gray-600 rounded-full px-2 text-xs">{incidentCount()}</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rdos" className="space-y-4 sm:space-y-10">
                        {rdos.length > 0 ? (
                            <InfiniteScroll
                                dataLength={rdos.length}
                                next={fetchMoreRdos}
                                hasMore={rdosHasMore}
                                className='space-y-4 sm:space-y-10'
                                loader={
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                }
                                endMessage={
                                    <div className="text-center py-4 text-muted-foreground">
                                        {t('endMessage')}
                                    </div>
                                }
                            >
                                {rdos.map((rdo) => (
                                    <FeedRDOCard key={rdo.id} rdo={rdo} />
                                ))}
                            </InfiniteScroll>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="text-muted-foreground text-lg mb-2">{t('empty.title')}</div>
                                <p className="text-sm text-muted-foreground/70 mb-4">{t('empty.description')}</p>
                                <Link href={`/rdo/create?project=${projectSlug}`}>
                                    <Button className="bg-primary hover:bg-primary/80">
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t('empty.createButton')}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="incidents" className="space-y-4 sm:space-y-10">
                        {incidents.length > 0 ? (
                            <InfiniteScroll
                                dataLength={incidents.length}
                                next={fetchMoreIncidents}
                                hasMore={incidentsHasMore}
                                className='space-y-4 sm:space-y-10'
                                loader={
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                }
                                endMessage={
                                    <div className="text-center py-4 text-muted-foreground">
                                        {t('endMessage')}
                                    </div>
                                }
                            >
                                {incidents.map((incident) => (
                                    <FeedIncidentCard key={incident.id} incident={incident} />
                                ))}
                            </InfiniteScroll>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="text-muted-foreground text-lg mb-2">{t('incidents.empty.title')}</div>
                                <p className="text-sm text-muted-foreground/70 mb-4">{t('incidents.empty.description')}</p>
                                <Link href={`/incident/create?project=${projectSlug}`}>
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
    );
} 