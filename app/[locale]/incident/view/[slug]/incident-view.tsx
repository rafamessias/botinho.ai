'use client';

import { Incident, StrapiImage, User, Project } from '@/components/types/strapi';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, File, Image as ImageIcon, Pencil, ArrowRight, Calendar, MapPin, Share2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { TooltipContent, TooltipTrigger, TooltipProvider, Tooltip } from '@/components/ui/tooltip';
import { usePathname, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import CarouselMedia from '@/components/feedPage/CarouselMedia';

export default function IncidentView({ incident }: { incident: Incident }) {
    const t = useTranslations('incident.view');
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    const user = incident.user as User;
    const project = incident.project as Project;
    const media = incident.media as StrapiImage[];

    const projectName = typeof incident.project === 'object' && incident.project ? incident.project.name : '';
    const projectDocumentId = typeof incident.project === 'object' && incident.project ? incident.project.documentId : '';

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open':
                return t('status.open');
            case 'wip':
                return t('status.inProgress');
            case 'closed':
                return t('status.closed');
            default:
                return status;
        }
    };

    const getStatusVariant = (status: string) => {
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

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'low':
                return t('priority.low');
            case 'medium':
                return t('priority.medium');
            case 'high':
                return t('priority.high');
            case 'critical':
                return t('priority.critical');
            default:
                return priority;
        }
    };

    const getPriorityVariant = (priority: string) => {
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
        <Card className="p-0 bg-transparent shadow-none hover:shadow-none">
            <CardHeader className="flex flex-col w-full items-start p-0 justify-between">
                <div className="w-full flex justify-end items-center gap-2 -mt-2">
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Link href={`/incident/edit/${incident.documentId}?goback=${currentUrl}`} className="flex items-center gap-2">
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
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 justify-start" onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/incident/view/${incident.documentId}`);
                                    toast.success('Link copied to clipboard');
                                }}>
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Share</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
                    <div className="flex items-start order-2 sm:order-1 gap-4">
                        <div>
                            <div className="text-xs">
                                <span className="text-muted-foreground mr-1">Incident</span>
                                <span className="font-bold text-gray-800">#{incident.id}</span>
                            </div>
                            <div className="text-xs mt-1 flex items-center gap-1">
                                <span className="text-muted-foreground">{t('reportedBy')}</span>
                                <span className="font-bold text-gray-800"> {user?.firstName} {user?.lastName}</span>
                            </div>
                            <div className="text-xs mt-1 flex items-center gap-1">
                                <span className="text-muted-foreground">{t('project')}</span>
                                {projectDocumentId && typeof projectDocumentId === 'string' && (
                                    <Link href={`/project/view/${projectDocumentId}`} className="font-bold underline text-gray-800"> {projectName}</Link>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {format(new Date(incident.createdAt || ''), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col order-1 sm:order-2 gap-2">
                        <Badge variant={getStatusVariant(incident.incidentStatus)} className="rounded-full px-3 py-1 text-xs font-medium">
                            {getStatusLabel(incident.incidentStatus)}
                        </Badge>

                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 p-0">
                {/* Media Gallery */}
                {Array.isArray(media) && media.length > 0 && (
                    <div>
                        <CarouselMedia images={media} />
                    </div>
                )}

                {/* Incident Description */}
                <div>
                    <div className="font-semibold text-sm mb-1">{t('description')}</div>
                    <div className="text-sm text-gray-800">{incident.description}</div>
                </div>

                {/* Comments section (placeholder) */}
                <div className="rounded-xl px-2 pt-2 pb-4">
                    <div className="font-semibold text-sm mb-4">{t('comments')}</div>
                    <div className="text-center text-gray-400 py-8">
                        {t('noComments')}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 