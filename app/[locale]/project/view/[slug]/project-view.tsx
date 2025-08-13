'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Image as ImageIcon, Pencil } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { TooltipContent, TooltipTrigger, TooltipProvider, Tooltip } from '@/components/ui/tooltip';
import { usePathname, useSearchParams } from 'next/navigation';
import ActivityCard from '@/components/shared/activity-card';
import UserCard from '@/components/shared/user-card';
import { useUser } from '@/components/UserProvider';
import { ProjectStatusBadge } from '@/components/shared/project-status-badge';
import { FileImage } from '@/components/types/prisma';
import { ProjectStatus, RDOStatus, IncidentStatus } from '@/lib/generated/prisma';

// Types for data with included relations
interface ProjectWithRelations {
    id: number;
    name: string | null;
    description: string | null;
    address: string | null;
    projectStatus: ProjectStatus | null;
    image: FileImage | null;
    rdoCount?: number | null;
    rdoCountDraft?: number | null;
    incidentCount?: number | null;
    incidentCountDraft?: number | null;
}

interface RDOWithRelations {
    id: number;
    description: string | null;
    date: Date | null;
    rdoStatus: RDOStatus | null;
    user: any;
    media: any[];
    userName?: string | null;
}

interface IncidentWithRelations {
    id: number;
    description: string | null;
    incidentStatus: IncidentStatus | null;
    priority: number | null;
    user: any;
    media: any[];
    userName?: string | null;
    createdAt: Date | null;
}

interface UserWithRelations {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    avatar: FileImage | null;
}

function InfoField({ label, value }: { label: string; value: string | undefined | null }) {
    if (!value) return null;
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-500">{label}</h2>
            <p className="text-base text-gray-800">{value}</p>
        </div>
    );
}

export default function ProjectView({ project, rdos, incidents, projectUsers }: {
    project: ProjectWithRelations;
    rdos: RDOWithRelations[];
    incidents?: IncidentWithRelations[];
    projectUsers?: UserWithRelations[]
}) {
    const t = useTranslations('project.view');
    const tIncident = useTranslations('incident');
    const [tab, setTab] = useState('rdos');
    const { user, isCompanyUser } = useUser();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

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

    const getRDOStatusLabel = (status: RDOStatus | null) => {
        if (!status) return '';
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

    const getRDOStatusVariant = (status: RDOStatus | null): "default" | "secondary" | "destructive" | "outline" => {
        if (!status) return 'outline';
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

    const getIncidentStatusLabel = (status: IncidentStatus | null) => {
        if (!status) return '';
        return tIncident(`status.${status}`);
    };

    const getIncidentStatusVariant = (status: IncidentStatus | null): "default" | "secondary" | "destructive" | "outline" => {
        if (!status) return 'outline';
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
                <div className="flex items-center justify-between">
                    <InfoField label={t('name')} value={`#${project.id} - ${project.name}`} />
                    <ProjectStatusBadge status={project.projectStatus || 'active'} showIcon={true} />
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
                                    const user = rdo.user as any;
                                    const media = rdo.media as any[];
                                    console.log('rdo', rdo);

                                    return (
                                        <ActivityCard
                                            key={rdo.id}
                                            id={rdo.id || 0}
                                            documentId={rdo.id?.toString() || ''}
                                            type="rdo"
                                            title="RDO"
                                            description={rdo.description || ''}
                                            date={new Date(rdo.date || '')}
                                            status={rdo.rdoStatus || 'draft'}
                                            user={user}
                                            userName={rdo?.userName || undefined}
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
                                    const user = incident.user as any;
                                    const media = incident.media as any[];
                                    console.log('incident', incident);

                                    return (
                                        <ActivityCard
                                            key={incident.id}
                                            id={incident.id || 0}
                                            documentId={incident.id?.toString() || ''}
                                            type="incident"
                                            title=""
                                            description={incident.description || ''}
                                            date={new Date(incident.createdAt || '')}
                                            status={incident.incidentStatus || 'open'}
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