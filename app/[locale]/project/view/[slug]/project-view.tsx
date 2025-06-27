'use client';

import { Project, StrapiImage, RDO, User, Incident } from '@/components/types/strapi';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, File, Image as ImageIcon, Pencil, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { TooltipContent, TooltipTrigger, TooltipProvider, Tooltip } from '@/components/ui/tooltip';
import { usePathname, useSearchParams } from 'next/navigation';
import ActivityCard from '@/components/shared/activity-card';
import MediaCard from '@/components/shared/media-card';
import UserCard from '@/components/shared/user-card';

function InfoField({ label, value }: { label: string; value: string | undefined | null }) {
    if (!value) return null;
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-500">{label}</h2>
            <p className="text-base text-gray-800">{value}</p>
        </div>
    );
}

export default function ProjectView({ project, rdos, incidents, projectUsers }: { project: Project; rdos: RDO[]; incidents?: Incident[]; projectUsers?: User[] }) {
    const t = useTranslations('project.view');
    const [tab, setTab] = useState('rdos');

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    const dummyMedia = [
        { id: 1, url: 'https://via.placeholder.com/150', type: 'image' },
        { id: 2, url: 'https://via.placeholder.com/150', type: 'image' },
        { id: 3, url: 'https://via.placeholder.com/150', type: 'image' },
        { id: 4, url: 'https://via.placeholder.com/150', type: 'image' },
    ];

    const dummyUsers = [
        { id: 1, name: 'John Doe', role: 'Engineer' },
        { id: 2, name: 'Jane Smith', role: 'Architect' },
    ];

    const getRDOStatusLabel = (status: RDO['rdoStatus']) => {
        switch (status) {
            case 'draft':
                return t('rdoStatus.draft');
            case 'pendingApproval':
                return t('rdoStatus.pendingApproval');
            case 'Approved':
                return t('rdoStatus.approved');
            case 'Rejected':
                return t('rdoStatus.rejected');
            default:
                return status;
        }
    };

    const getRDOStatusVariant = (status: RDO['rdoStatus']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Approved':
                return 'default';
            case 'Rejected':
                return 'destructive';
            case 'pendingApproval':
                return 'secondary';
            case 'draft':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getIncidentStatusLabel = (status: string) => {
        switch (status) {
            case 'open':
                return 'Open';
            case 'wip':
                return 'In Progress';
            case 'closed':
                return 'Closed';
            default:
                return status;
        }
    };

    const getIncidentStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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

    const getIncidentPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'low':
                return 'Low';
            case 'medium':
                return 'Medium';
            case 'high':
                return 'High';
            case 'critical':
                return 'Critical';
            default:
                return priority;
        }
    };

    const getIncidentPriorityVariant = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (priority) {
            case 'low':
                return 'outline';
            case 'medium':
                return 'secondary';
            case 'high':
                return 'destructive';
            case 'critical':
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
                        src={(project.image as StrapiImage).url}
                        alt={project.name}
                        layout="fill"
                        objectFit="cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
            <div className=" w-full flex justify-end items-center gap-2 mt-[198px]">
                <TooltipProvider >
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Link href={`/project/edit/${project.documentId}?goback=${currentUrl}`} className="absolute flex items-center gap-2">
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

            <div className="flex flex-col gap-6 px-4 pb-4 bg-white rounded-lg ">
                <InfoField label={t('name')} value={`#${project.id} - ${project.name}`} />
                <InfoField label={t('description')} value={project.description} />
                <InfoField label={t('address')} value={project.address} />
            </div>

            <div className="rounded-xl">
                <Tabs value={tab} onValueChange={setTab} className="w-full relative" orientation="horizontal">
                    <TabsList className="absolute flex flex-row justify-stretch w-full bg-transparent overflow-x-auto">
                        <TabsTrigger value="rdos" className="flex items-center gap-2">
                            {t('tabs.rdos')} <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 text-xs">{project.rdoCount || 0}</span>
                        </TabsTrigger>
                        <TabsTrigger value="incidents" className="flex items-center gap-2">
                            {t('tabs.incidents')} <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 text-xs">{project.incidentCount || 0}</span>
                        </TabsTrigger>
                        {/*
                        <TabsTrigger value="media" className="flex items-center gap-2">
                            {t('tabs.media')} <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 text-xs">{project.photoCount || 0}</span>
                        </TabsTrigger>
                        */}
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            {t('tabs.users')} <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 text-xs">{projectUsers?.length || 0}</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rdos" className="mt-14">
                        <div className="space-y-4">
                            {rdos.length > 0 ? (
                                rdos.map(rdo => {
                                    const user = rdo.user as User;
                                    const media = rdo.media as StrapiImage[];

                                    return (
                                        <ActivityCard
                                            key={rdo.id}
                                            id={rdo.id || 0}
                                            documentId={rdo.documentId || ''}
                                            type="rdo"
                                            title="RDO"
                                            description={rdo.description}
                                            date={new Date(rdo.date)}
                                            status={rdo.rdoStatus}
                                            user={user}
                                            media={media}
                                            getStatusLabel={getRDOStatusLabel}
                                            getStatusVariant={getRDOStatusVariant}
                                            t={t}
                                        />
                                    );
                                })
                            ) : (
                                <div className="text-center text-gray-400 py-4">{t('tabs.noRdos')}</div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="incidents" className="mt-14">
                        <div className="space-y-4">
                            {incidents && incidents.length > 0 ? (
                                incidents.map(incident => {
                                    const user = incident.user as User;
                                    const media = incident.media as StrapiImage[];

                                    return (
                                        <ActivityCard
                                            key={incident.id}
                                            id={incident.id || 0}
                                            documentId={incident.documentId || ''}
                                            type="incident"
                                            title=""
                                            description={incident.description}
                                            date={new Date(incident.createdAt || '')}
                                            status={incident.incidentStatus}
                                            priority={incident.priority}
                                            user={user}
                                            media={media}
                                            getStatusLabel={getIncidentStatusLabel}
                                            getStatusVariant={getIncidentStatusVariant}
                                            getPriorityLabel={getIncidentPriorityLabel}
                                            getPriorityVariant={getIncidentPriorityVariant}
                                            t={t}
                                        />
                                    );
                                })
                            ) : (
                                <div className="text-center text-gray-400 py-4">{t('tabs.noIncidents')}</div>
                            )}
                        </div>
                    </TabsContent>
                    {/* 
                    <TabsContent value="media" className="mt-10">
                        {projectMedia && projectMedia.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {projectMedia.map(media => (
                                    <MediaCard key={media.id} media={media} t={t} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-4">{t('tabs.noMedia')}</div>
                        )}
                    </TabsContent>
*/}
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