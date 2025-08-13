'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ProjectStatus, RDOStatus, IncidentStatus } from '@/lib/generated/prisma';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Pencil } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { TooltipContent, TooltipTrigger, TooltipProvider, Tooltip } from '@/components/ui/tooltip';
import { usePathname, useSearchParams } from 'next/navigation';
import ActivityCard from '@/components/shared/activity-card';
import UserCard from '@/components/shared/user-card';
import { useUser } from '@/components/UserProvider';
import { Loader2 } from 'lucide-react';
import { getPaginatedProjectRdos, getPaginatedProjectIncidents } from '@/components/actions/project-actions';
import { ProjectStatusBadge } from '@/components/shared/project-status-badge';
import { FileImage } from '@/components/types/prisma';

// Types for data with included relations
interface ProjectWithRelations {
    id: number;
    name: string | null;
    description: string | null;
    address: string | null;
    projectStatus: ProjectStatus;
    image: FileImage | null;
    rdoCount?: number | null;
    rdoCountDraft?: number | null;
    incidentCount?: number | null;
    incidentCountDraft?: number | null;
}

interface RDOWithRelations {
    id: number;
    description: string | null;
    date: Date;
    rdoStatus: RDOStatus;
    user: any;
    media: any[];
    userName?: string | null;
}

interface IncidentWithRelations {
    id: number;
    description: string | null;
    incidentStatus: IncidentStatus;
    priority: number | null;
    user: any;
    media: any[];
    userName?: string | null;
    createdAt: Date;
}

interface ProjectUserWithRelations {
    id: number;
    name: string;
    email: string;
    phone: string;
    canApprove: boolean;
    user: any;
}

interface ProjectViewWithInfiniteScrollProps {
    project: ProjectWithRelations;
    initialRdos: RDOWithRelations[];
    initialIncidents: IncidentWithRelations[];
    projectUsers: ProjectUserWithRelations[];
    projectSlug: string;
}

const ITEMS_PER_PAGE = Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) || 10;

function InfoField({ label, value }: { label: string; value: string | undefined | null }) {
    if (!value) return null;
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-500">{label}</h2>
            <p className="text-base text-gray-800">{value}</p>
        </div>
    );
}

export default function ProjectViewWithInfiniteScroll({
    project,
    initialRdos,
    initialIncidents,
    projectUsers,
    projectSlug
}: ProjectViewWithInfiniteScrollProps) {
    const t = useTranslations('project.view');
    const tIncident = useTranslations('incident');
    const [tab, setTab] = useState('rdos');
    const { user, isCompanyUser } = useUser();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    // Screen size detection
    const [screenHeight, setScreenHeight] = useState(0);
    const [estimatedItemHeight, setEstimatedItemHeight] = useState(200); // Estimated height of each item

    useEffect(() => {
        const updateScreenSize = () => {
            setScreenHeight(window.innerHeight);
        };

        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);

    // Calculate how many items we need to fill the screen
    const calculateItemsToFillScreen = useCallback(() => {
        if (screenHeight === 0) return ITEMS_PER_PAGE;

        // Account for header, tabs, and other UI elements (approximately 400px)
        const availableHeight = screenHeight - 400;
        const itemsNeeded = Math.ceil(availableHeight / estimatedItemHeight);

        // Ensure we load at least ITEMS_PER_PAGE items, but more if needed to fill screen
        // Also ensure we have at least 3 items to enable scrolling
        return Math.max(ITEMS_PER_PAGE, itemsNeeded, 3);
    }, [screenHeight, estimatedItemHeight]);

    // RDOs state
    const [rdos, setRdos] = useState<RDOWithRelations[]>(initialRdos);
    const [rdosHasMore, setRdosHasMore] = useState(initialRdos.length >= ITEMS_PER_PAGE);
    const [rdosPage, setRdosPage] = useState(1);
    const [rdosLoading, setRdosLoading] = useState(false);

    // Incidents state
    const [incidents, setIncidents] = useState<IncidentWithRelations[]>(initialIncidents);
    const [incidentsHasMore, setIncidentsHasMore] = useState(initialIncidents.length >= ITEMS_PER_PAGE);
    const [incidentsPage, setIncidentsPage] = useState(1);
    const [incidentsLoading, setIncidentsLoading] = useState(false);

    // Refs to track current state and prevent duplicate calls
    const rdosPageRef = useRef(1);
    const rdosHasMoreRef = useRef(initialRdos.length >= ITEMS_PER_PAGE);
    const rdosLoadingRef = useRef(false);

    const incidentsPageRef = useRef(1);
    const incidentsHasMoreRef = useRef(initialIncidents.length >= ITEMS_PER_PAGE);
    const incidentsLoadingRef = useRef(false);

    // Flags to track initial loading
    const [rdosInitialLoadComplete, setRdosInitialLoadComplete] = useState(false);
    const [incidentsInitialLoadComplete, setIncidentsInitialLoadComplete] = useState(false);

    // Update refs when state changes
    useEffect(() => {
        rdosPageRef.current = rdosPage;
        rdosHasMoreRef.current = rdosHasMore;
        rdosLoadingRef.current = rdosLoading;
    }, [rdosPage, rdosHasMore, rdosLoading]);

    useEffect(() => {
        incidentsPageRef.current = incidentsPage;
        incidentsHasMoreRef.current = incidentsHasMore;
        incidentsLoadingRef.current = incidentsLoading;
    }, [incidentsPage, incidentsHasMore, incidentsLoading]);

    // Initial loading to ensure enough items for scrolling
    useEffect(() => {
        const loadInitialItems = async () => {
            if (screenHeight === 0) return;

            const itemsNeeded = calculateItemsToFillScreen();

            // Load more RDOs if needed (only once)
            if (!rdosInitialLoadComplete && rdos.length < itemsNeeded && rdosHasMore && !rdosLoading) {
                const itemsToLoad = Math.ceil((itemsNeeded - rdos.length) / ITEMS_PER_PAGE);

                for (let i = 0; i < itemsToLoad; i++) {
                    if (rdosLoadingRef.current || !rdosHasMoreRef.current) break;

                    setRdosLoading(true);
                    try {
                        const nextPage = rdosPageRef.current + 1;
                        const response = await getPaginatedProjectRdos(projectSlug, nextPage, ITEMS_PER_PAGE);

                        if (response.success && response.data) {
                            setRdos(prev => [...prev, ...(response.data as any)]);
                            setRdosPage(nextPage);
                            setRdosHasMore(response.data.length === ITEMS_PER_PAGE);
                        }
                    } catch (error) {
                        console.error('Error fetching initial RDOs:', error);
                        break;
                    } finally {
                        setRdosLoading(false);
                    }
                }
                setRdosInitialLoadComplete(true);
            }

            // Load more incidents if needed (only once)
            if (!incidentsInitialLoadComplete && incidents.length < itemsNeeded && incidentsHasMore && !incidentsLoading) {
                const itemsToLoad = Math.ceil((itemsNeeded - incidents.length) / ITEMS_PER_PAGE);

                for (let i = 0; i < itemsToLoad; i++) {
                    if (incidentsLoadingRef.current || !incidentsHasMoreRef.current) break;

                    setIncidentsLoading(true);
                    try {
                        const nextPage = incidentsPageRef.current + 1;
                        const response = await getPaginatedProjectIncidents(projectSlug, nextPage, ITEMS_PER_PAGE);

                        if (response.success && response.data) {
                            setIncidents(prev => [...prev, ...(response.data as any)]);
                            setIncidentsPage(nextPage);
                            setIncidentsHasMore(response.data.length === ITEMS_PER_PAGE);
                        }
                    } catch (error) {
                        console.error('Error fetching initial incidents:', error);
                        break;
                    } finally {
                        setIncidentsLoading(false);
                    }
                }
                setIncidentsInitialLoadComplete(true);
            }
        };

        loadInitialItems();
    }, [screenHeight, calculateItemsToFillScreen, rdosInitialLoadComplete, incidentsInitialLoadComplete, projectSlug]);

    const rdoTotal = () => {
        if (user?.companyMember) {
            return Number(project.rdoCount || 0) + Number(project.rdoCountDraft || 0);
        }
        return Number(project.rdoCount || 0);
    }

    const incidentTotal = () => {
        if (user?.companyMember) {
            return Number(project.incidentCount || 0) + Number(project.incidentCountDraft || 0);
        }
        return Number(project.incidentCount || 0);
    }

    const fetchMoreRdos = useCallback(async () => {
        if (rdosLoadingRef.current || !rdosHasMoreRef.current) return;

        setRdosLoading(true);
        try {
            const nextPage = rdosPageRef.current + 1;
            const response = await getPaginatedProjectRdos(projectSlug, nextPage, ITEMS_PER_PAGE);

            if (response.success && response.data) {
                setRdos(prev => [...prev, ...(response.data as any)]);
                setRdosPage(nextPage);
                setRdosHasMore(response.data.length === ITEMS_PER_PAGE);
            }
        } catch (error) {
            console.error('Error fetching more RDOs:', error);
        } finally {
            setRdosLoading(false);
        }
    }, [projectSlug]);

    const fetchMoreIncidents = useCallback(async () => {
        if (incidentsLoadingRef.current || !incidentsHasMoreRef.current) return;

        setIncidentsLoading(true);
        try {
            const nextPage = incidentsPageRef.current + 1;
            const response = await getPaginatedProjectIncidents(projectSlug, nextPage, ITEMS_PER_PAGE);

            if (response.success && response.data) {
                setIncidents(prev => [...prev, ...(response.data as any)]);
                setIncidentsPage(nextPage);
                setIncidentsHasMore(response.data.length === ITEMS_PER_PAGE);
            }
        } catch (error) {
            console.error('Error fetching more incidents:', error);
        } finally {
            setIncidentsLoading(false);
        }
    }, [projectSlug]);

    const getRDOStatusLabel = (status: RDOWithRelations['rdoStatus']) => {
        switch (status) {
            case 'draft':
                return t('rdoStatus.draft');
            case 'pendingApproval':
                return t('rdoStatus.pendingApproval');
            case 'approved':
                return t('rdoStatus.approved');
            case 'rejected':
                return t('rdoStatus.rejected');
            default:
                return status;
        }
    };

    const getRDOStatusVariant = (status: RDOWithRelations['rdoStatus']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'approved':
                return 'default';
            case 'rejected':
                return 'destructive';
            case 'pendingApproval':
                return 'secondary';
            case 'draft':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getIncidentStatusLabel = (status: IncidentWithRelations['incidentStatus']) => {
        return tIncident(`status.${status}`);
    };

    const getIncidentStatusVariant = (status: IncidentWithRelations['incidentStatus']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'open':
                return 'destructive';
            case 'wip':
                return 'secondary';
            case 'closed':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getIncidentPriorityLabel = (priority: number | null) => {
        if (priority === null) return 'N/A';
        switch (priority) {
            case 1:
                return 'Low';
            case 2:
                return 'Medium';
            case 3:
                return 'High';
            case 4:
                return 'Critical';
            default:
                return priority.toString();
        }
    };

    const getIncidentPriorityVariant = (priority: number | null): "default" | "secondary" | "destructive" | "outline" => {
        if (priority === null) return 'outline';
        switch (priority) {
            case 1:
                return 'outline';
            case 2:
                return 'secondary';
            case 3:
                return 'destructive';
            case 4:
                return 'destructive';
            default:
                return 'outline';
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="absolute top-0 left-0 w-full h-48 rounded-t-lg overflow-hidden">
                {project.image ? (
                    <Image
                        src={typeof project.image === 'string' ? project.image : (project.image as FileImage)?.url || ''}
                        alt={project.name || ''}
                        fill
                        sizes="200px"
                        priority={true}
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
            {isCompanyUser && (
                <div className=" w-full flex justify-end items-center gap-2 mt-[198px]">
                    <TooltipProvider >
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Link href={`/project/edit/${project.id}?goback=${currentUrl}`} className="absolute flex items-center gap-2">
                                    <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('edit')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}

            <div className={`flex flex-col gap-6 px-4 pb-4 bg-white rounded-lg ${isCompanyUser ? '' : 'mt-[198px]'}`}>
                <div className="flex items-start justify-between">
                    <InfoField label={t('name')} value={`#${project.id} - ${project.name}`} />
                    <ProjectStatusBadge status={project.projectStatus} showIcon={false} />
                </div>
                <InfoField label={t('description')} value={project.description} />
                <InfoField label={t('address')} value={project.address} />
            </div>

            <div className="rounded-xl">
                <Tabs value={tab} onValueChange={setTab} className="w-full relative" orientation="horizontal">
                    <TabsList className="absolute flex flex-row justify-stretch w-full bg-transparent overflow-x-auto">
                        <TabsTrigger value="rdos" className="flex items-center gap-2">
                            {t('tabs.rdos')} <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 text-xs">{rdoTotal()}</span>
                        </TabsTrigger>
                        <TabsTrigger value="incidents" className="flex items-center gap-2">
                            {t('tabs.incidents')} <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 text-xs">{incidentTotal()}</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            {t('tabs.users')} <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 text-xs">{projectUsers?.length || 0}</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rdos" className="mt-14">
                        {rdos.length > 0 ? (
                            <InfiniteScroll
                                dataLength={rdos.length}
                                next={fetchMoreRdos}
                                hasMore={rdosHasMore}
                                className='space-y-4'
                                loader={
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                }
                                endMessage={
                                    <div className="text-center py-4 text-muted-foreground">
                                        {t('tabs.endMessage')}
                                    </div>
                                }
                            >
                                {rdos.map(rdo => {
                                    const user = rdo.user as any;
                                    const media = rdo.media as any[];

                                    return (
                                        <ActivityCard
                                            key={rdo.id}
                                            id={rdo.id || 0}
                                            documentId={rdo.id?.toString() || ''}
                                            type="rdo"
                                            title="RDO"
                                            description={rdo.description || ''}
                                            date={new Date(rdo.date)}
                                            status={rdo.rdoStatus}
                                            user={user}
                                            userName={rdo?.userName || undefined}
                                            media={media}
                                            getStatusLabel={getRDOStatusLabel}
                                            getStatusVariant={getRDOStatusVariant}
                                            t={t}
                                        />
                                    );
                                })}
                            </InfiniteScroll>
                        ) : (
                            <div className="text-center text-gray-400 py-4">{t('tabs.noRdos')}</div>
                        )}
                    </TabsContent>

                    <TabsContent value="incidents" className="mt-14">
                        {incidents && incidents.length > 0 ? (
                            <InfiniteScroll
                                dataLength={incidents.length}
                                next={fetchMoreIncidents}
                                hasMore={incidentsHasMore}
                                className='space-y-4'
                                loader={
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                }
                                endMessage={
                                    <div className="text-center py-4 text-muted-foreground">
                                        {t('tabs.endMessage')}
                                    </div>
                                }
                            >
                                {incidents.map(incident => {
                                    const user = incident.user as any;
                                    const media = incident.media as any[];

                                    return (
                                        <ActivityCard
                                            key={incident.id}
                                            id={incident.id || 0}
                                            documentId={incident.id?.toString() || ''}
                                            type="incident"
                                            title=""
                                            description={incident.description || ''}
                                            date={new Date(incident.createdAt || '')}
                                            status={incident.incidentStatus}
                                            priority={incident.priority || undefined}
                                            user={user}
                                            userName={incident?.userName || undefined}
                                            media={media}
                                            getStatusLabel={getIncidentStatusLabel}
                                            getStatusVariant={getIncidentStatusVariant}
                                            getPriorityLabel={getIncidentPriorityLabel}
                                            getPriorityVariant={getIncidentPriorityVariant}
                                            t={t}
                                        />
                                    );
                                })}
                            </InfiniteScroll>
                        ) : (
                            <div className="text-center text-gray-400 py-4">{t('tabs.noIncidents')}</div>
                        )}
                    </TabsContent>

                    <TabsContent value="users" className="mt-14">
                        <div className="space-y-4">
                            {projectUsers && projectUsers.length > 0 ? (
                                projectUsers.map(user => (
                                    <UserCard key={user.id} user={user} t={t} />
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-4">{t('tabs.noUsers')}</div>
                            )}
                        </div>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
} 