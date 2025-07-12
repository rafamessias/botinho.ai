'use client';

import { Incident, StrapiImage, User, Project } from '@/components/types/strapi';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Pencil, Share2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { TooltipContent, TooltipTrigger, TooltipProvider, Tooltip } from '@/components/ui/tooltip';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import CarouselMedia from '@/components/feedPage/CarouselMedia';
import { CommentsSection } from '@/components/shared/comments-section';
import { useUser } from '@/components/UserProvider';
import { updateIncidentStatus } from '@/components/actions/incident-action';
import { getClientInfo } from '@/components/approval/approval-audit';
import { useLoading } from '@/components/LoadingProvider';

export default function IncidentView({ incident }: { incident: Incident }) {
    const t = useTranslations('incident.view');
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    const { user: userAuth, isCompanyUser } = useUser();
    const router = useRouter();
    const { setIsLoading } = useLoading();

    const userName = incident.userName;
    const project = incident.project as Project;
    const media = incident.media as StrapiImage[];

    const projectName = typeof incident.project === 'object' && incident.project ? incident.project.name : '';
    const projectDocumentId = typeof incident.project === 'object' && incident.project ? incident.project.documentId : '';
    const projectId = (typeof incident.project === 'object' && incident.project ? incident.project.id : null) || null;

    const handleStatusUpdate = async (status: 'open' | 'wip' | 'closed' | 'draft') => {
        if (!incident.documentId) return;

        try {
            setIsLoading(true);
            const clientInfo = await getClientInfo();
            const response = await updateIncidentStatus(incident.documentId, status, clientInfo);
            if (response.success) {
                toast.success(t(`actions.UpdatedSuccess`));
                router.refresh();
            } else {
                toast.error(response.error || t(`actions.UpdatedError`));
            }
        } catch (error) {
            console.error('Error updating incident status:', error);
            toast.error(t(`actions.UpdatedError`));
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusLabel = (status: string) => {
        return t(`status.${status}`);
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'draft':
                return 'outline';
            case 'open':
                return 'outline';
            case 'wip':
                return 'secondary';
            case 'closed':
                return 'default';
            default:
                return 'outline';
        }
    };

    return (
        <Card className="p-0 bg-transparent shadow-none hover:shadow-none">
            <CardHeader className="flex flex-col w-full items-start p-0 justify-between">
                <div className="w-full flex justify-end items-center gap-2">
                    {userAuth?.type === 'companyUser' && (
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
                    )}
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
                                <span className="text-muted-foreground mr-1">{t('title')}</span>
                                <span className="font-bold text-gray-800">#{incident.id}</span>
                            </div>
                            <div className="text-xs mt-1 flex items-center gap-1">
                                <span className="text-muted-foreground">{t('reportedBy')}</span>
                                <span className="font-bold text-gray-800"> {userName}</span>
                            </div>
                            <div className="text-xs mt-1 flex items-center gap-1">
                                <span className="text-muted-foreground">{t('project')}</span>
                                {projectDocumentId && typeof projectDocumentId === 'string' && (
                                    <Link href={`/project/view/${projectDocumentId}`} className="font-bold underline text-gray-800"> {projectName}</Link>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {format(new Date(incident.date as string), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
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
                    <div className="mt-6">
                        <CarouselMedia images={media} />
                    </div>
                )}

                {/* Incident Description */}
                <div>
                    <div className="font-semibold text-sm mt-6 mb-1">{t('description')}</div>
                    <div className="text-sm text-gray-800">{incident.description}</div>
                </div>

                <div className="flex items-center justify-end w-full gap-2">
                    {incident.incidentStatus === 'draft' && isCompanyUser && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors"
                                onClick={() => handleStatusUpdate('open')}
                            >
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {t('actions.open')}
                            </Button>

                        </>
                    )}
                    {incident.incidentStatus === 'open' && isCompanyUser && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate('draft')}
                            >
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {t('actions.draft')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                onClick={() => handleStatusUpdate('wip')}
                            >
                                <Clock className="w-4 h-4 mr-1" />
                                {t('actions.wip')}
                            </Button>
                        </>
                    )}
                    {incident.incidentStatus === 'wip' && isCompanyUser && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate('draft')}
                            >
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {t('actions.draft')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                                onClick={() => handleStatusUpdate('closed')}
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {t('actions.close')}
                            </Button>
                        </>
                    )}
                </div>


                {/* Comments section */}
                <div className="rounded-xl pt-2 pb-4">
                    <CommentsSection
                        incidentDocumentId={incident.documentId}
                        incidentId={incident.id}
                        initialComments={incident.comments || []}
                        projectId={projectId}
                    />
                </div>
            </CardContent>
        </Card>
    );
} 