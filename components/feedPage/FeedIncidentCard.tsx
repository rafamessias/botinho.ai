'use client'
import React from 'react';
import CarouselMedia from '@/components/feedPage/CarouselMedia';
import { MessageSquare, EllipsisVertical, X, Check, Share2, Pencil, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Incident, StrapiImage, User } from '@/components/types/strapi';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { updateIncidentStatus } from '@/components/actions/incident-action';
import { useLoading } from '@/components/LoadingProvider';
import { toast } from 'sonner';
import { getClientInfo } from '@/components/approval/approval-audit';
import { useUser } from '../UserProvider';

const getPriorityIcon = (priority: number | null) => {
    if (!priority) return null;

    switch (priority) {
        case 1:
            return <AlertTriangle className="w-2 h-2 text-red-500" />;
        case 2:
            return <Clock className="w-2 h-2 text-yellow-500" />;
        case 3:
            return <CheckCircle className="w-2 h-2 text-green-500" />;
        default:
            return null;
    }
};

const FeedIncidentCard = ({ incident }: { incident: Incident }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setIsLoading } = useLoading();
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    const { user: userAuth, isCompanyUser } = useUser();

    const t = useTranslations('incident.incidentCard');
    const userName = incident.userName;

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

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'draft':
                return 'outline';
            case 'open':
                return 'destructive';
            case 'wip':
                return 'secondary';
            case 'closed':
                return 'default';
            default:
                return 'outline';
        }
    };

    const getPriorityVariant = (priority: number | null) => {
        if (!priority) return 'outline';

        switch (priority) {
            case 1:
                return 'destructive';
            case 2:
                return 'secondary';
            case 3:
                return 'default';
            default:
                return 'outline';
        }
    };

    return (
        <Card className="p-6 space-y-4 !rounded-none sm:!rounded-xl !shadow-none sm:!shadow-sm border border-gray-100 sm:!border-none hover:!shadow-md transition-shadow">
            <CardHeader className="p-0 relative">
                <div className="absolute top-0 right-0 w-full flex justify-end items-center gap-2 -mt-2">
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
                                    toast.success(t('linkCopied'));
                                }}>
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('share')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-col gap-1">
                        <div className="text-xs flex items-center gap-1">
                            <span className="text-muted-foreground">{t('title')}</span>
                            <span className="font-bold text-gray-800">#{incident.id}</span>
                        </div>
                        <div className="text-xs flex items-center gap-1">
                            <span className="text-muted-foreground">{t('reportedBy')}</span>
                            <span className="font-bold text-gray-800">{userName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {incident.date ? new Date(incident.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {incident.priority && (
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Badge
                                        variant={getPriorityVariant(incident.priority)}
                                        className="flex items-center gap-1 rounded-lg text-xs shadow-sm cursor-default"
                                    >
                                        {t(`priority.${incident.priority}`)} {getPriorityIcon(incident.priority)}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t(`priority.description.${incident.priority}`)}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="text-sm mb-4 text-gray-800">
                    {incident.description.length > 200 ? `${incident.description.substring(0, 200)}...` : incident.description}
                </div>
                <CarouselMedia images={incident.media as StrapiImage[] || []} />
            </CardContent>
            <CardFooter className="p-0 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-gray-500 w-full">
                    <div className="flex gap-4">
                        <Link href={`/incident/view/${incident.documentId}?goback=${currentUrl}`} className="text-blue-600 hover:text-blue-700 transition-colors">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 transition-colors">
                                {t('details')}
                            </Button>
                        </Link>
                        <Link href={`/incident/view/${incident.documentId}?goback=${currentUrl}`} className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 transition-colors">
                                <MessageSquare className="w-4 h-4" /> {incident.commentCount || 0}
                            </Button>
                        </Link>
                    </div>
                    <Badge
                        variant={getStatusVariant(incident.incidentStatus)}
                        className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            incident.incidentStatus === 'closed' && 'bg-green-100 text-green-700',
                            incident.incidentStatus === 'wip' && 'bg-blue-100 text-blue-700',
                            incident.incidentStatus === 'open' && 'bg-red-100 text-red-700',
                            incident.incidentStatus === 'draft' && 'bg-gray-100 text-gray-700'
                        )}
                    >
                        {t(incident.incidentStatus)}
                    </Badge>
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
            </CardFooter>
        </Card>
    );
};

export default FeedIncidentCard; 