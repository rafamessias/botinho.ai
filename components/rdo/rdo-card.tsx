'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, Sun, CloudRain, Share2, Pencil, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import CarouselMedia from '../feedPage/CarouselMedia';
import { Approval, RDO, RDOWithCommentsAndAudit, User } from '@/components/types/prisma';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { updateRDOStatus } from '../actions/rdo-action';
import { useLoading } from '../LoadingProvider';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';
import { getClientInfo } from '@/components/approval/approval-audit';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CommentsSection } from '@/components/shared/comments-section';
import { useUser } from '@/components/getUser';

export function RdoCard({ rdo }: { rdo: RDOWithCommentsAndAudit }) {
    const t = useTranslations('rdo.rdoCard');
    const [tab, setTab] = useState<'comments' | 'audit'>('comments');
    const { setIsLoading } = useLoading();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const userName = rdo.createdBy;
    const { user: userAuth } = useUser();
    const [pUCanApprove, setPUCanApprove] = useState<boolean>(false);

    const projectName = typeof rdo.project === 'object' ? rdo.project.name : '';
    const projectId = (typeof rdo.project === 'object' ? rdo.project.id : 0) || 0;

    const { companyMemberCanApprove, projectUserCanApprove } = useUser();

    useEffect(() => {
        if (projectUserCanApprove) {
            setPUCanApprove(projectUserCanApprove(projectId));
        }
    }, [projectUserCanApprove, projectId]);


    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    const handleApprove = async () => {
        if (!rdo.id) {
            toast.error(t('actions.approveError'));
            return;
        }
        try {
            setIsLoading(true);
            const approvalStatus = rdo.rdoStatus === 'draft' || rdo.rdoStatus === 'rejected' ? 'pendingApproval' : 'approved';
            const clientInfo = await getClientInfo();
            const response = await updateRDOStatus(rdo.id || 0, approvalStatus, clientInfo);
            if (response.success) {
                toast.success(t('actions.approveSuccess'));
                router.refresh();
            } else {
                toast.error(response.error || t('actions.approveError'));
            }
        } catch (error) {
            toast.error(t('actions.approveError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rdo.id) {
            toast.error(t('actions.rejectError'));
            return;
        }
        try {
            setIsLoading(true);
            const rejectionStatus = rdo.rdoStatus === 'pendingApproval' ? 'rejected' : 'pendingApproval';
            const clientInfo = await getClientInfo();
            const response = await updateRDOStatus(rdo.id || 0, rejectionStatus, clientInfo);
            if (response.success) {
                toast.success(t('actions.rejectSuccess'));
                router.refresh();
            } else {
                toast.error(response.error || t('actions.rejectError'));
            }
        } catch (error) {
            toast.error(t('actions.rejectError'));
        } finally {
            setIsLoading(false);
        }
    };

    // Mock data for weather, equipment, workforce, and occurrences
    const getWeatherIcon = (condition: string | null) => {
        if (!condition) return null;

        switch (condition) {
            case 'clear':
                return <Sun className="w-4 h-4" />;
            case 'cloudy':
                return <Cloud className="w-4 h-4" />;
            case 'rainy':
                return <CloudRain className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const equipment = rdo.equipmentUsed;
    const workforce = rdo.workforce;

    const getStatusLabel = (status: RDO['rdoStatus']) => {
        switch (status) {
            case 'draft':
                return t('draft');
            case 'pendingApproval':
                return t('pendingApproval');
            case 'approved':
                return t('approved');
            case 'rejected':
                return t('rejected');
            default:
                return status;
        }
    };

    return (
        <>
            <Card className="p-0 bg-transparent shadow-none hover:shadow-none !rounded-none sm:!rounded-xl">
                <CardHeader className="relative sm:static flex flex-col w-full items-start p-0 justify-between">
                    <div className="absolute sm:static top-0 right-0 w-full flex justify-end items-center gap-2 -mt-2">
                        {userAuth?.type === 'companyUser' && (
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Link href={`/rdo/edit/${rdo.id}?goback=${currentUrl}`} className="flex items-center gap-2">
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
                                        navigator.clipboard.writeText(`${window.location.origin}/rdo/view/${rdo.id}`);
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
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
                        <div className="flex items-start order-2 sm:order-1 gap-4">
                            <div>
                                <div className="text-xs">
                                    <span className="text-muted-foreground mr-1">RDO</span>
                                    <span className="font-bold text-gray-800">#{rdo.id}</span>
                                </div>
                                <div className="text-xs mt-1 flex items-center gap-1">
                                    <span className="text-muted-foreground">{t('postedBy')}</span>
                                    <span className="font-bold text-gray-800"> {userName}</span>
                                </div>
                                <div className="text-xs mt-1 flex items-center gap-1">
                                    <span className="text-muted-foreground">{t('project')}</span>
                                    <Link href={`/project/view/${projectId}`} className="font-bold underline text-gray-800"> {projectName}</Link>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {new Date(rdo.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col order-1 sm:order-2 gap-2">

                            <Badge className={cn(
                                'rounded-full px-3 py-1 text-xs font-medium',
                                rdo.rdoStatus === 'approved' && 'bg-green-100 text-green-700',
                                rdo.rdoStatus === 'rejected' && 'bg-red-100 text-red-700',
                                rdo.rdoStatus === 'pendingApproval' && 'bg-blue-100 text-blue-700',
                                rdo.rdoStatus === 'draft' && 'bg-gray-100 text-gray-700')
                            }>
                                {getStatusLabel(rdo.rdoStatus)}
                            </Badge>

                        </div>
                    </div>

                </CardHeader>
                <CardContent className="space-y-6 p-0 mt-4">
                    {/* Condição Climática */}
                    <div>
                        <div className="font-semibold text-sm mb-4">{t('weather.title')}</div>
                        <div className="flex flex-row gap-2 overflow-x-auto">
                            {[
                                { period: t('morning'), weather: rdo.weatherMorningCondition, workable: rdo.weatherMorningWorkable },
                                { period: t('afternoon'), weather: rdo.weatherAfternoonCondition, workable: rdo.weatherAfternoonWorkable },
                                { period: t('night'), weather: rdo.weatherNightCondition, workable: rdo.weatherNightWorkable }
                            ].map((weather) => {
                                if (weather.weather !== null) {
                                    return (

                                        <Badge
                                            variant='outline'
                                            key={weather.period}
                                            className={`flex flex-col py-2 items-center gap-1 rounded-lg text-xs shadow-sm cursor-default ${!weather.workable
                                                && 'bg-red-50 text-red-900 hover:bg-red-100 hover:text-red-900'
                                                }`}
                                        >
                                            <div className='flex items-center gap-1'>
                                                {weather.period} {getWeatherIcon(weather.weather)}
                                            </div>
                                            <div className={`text-[10px] text-muted-foreground ${!weather.workable && 'text-red-900'}`}>
                                                {t(`weather.${weather.weather}`)} - {t(`weather.${weather.workable}`)}
                                            </div>
                                        </Badge>

                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>

                    {/* Atividades Executadas */}
                    <div >
                        {Array.isArray(rdo.media) && rdo.media.length > 0 && (
                            <CarouselMedia images={rdo.media} />
                        )}
                        <div className="font-semibold text-sm mb-1 mt-4">{t('activities.title')}</div>
                        <div className="text-sm text-gray-800 mb-2">
                            {(rdo.description.length > 200 ? `${rdo.description.substring(0, 200)}...` : rdo.description)
                                .split('\n')
                                .map((line, idx) => (
                                    <span key={idx}>
                                        {line}
                                        <br />
                                    </span>
                                ))
                            }
                        </div>

                    </div>
                    {/* Equipamentos Utilizados */}
                    <div>
                        <div className="font-semibold text-sm mb-1">{t('equipment.title')}</div>
                        <div className="text-sm text-gray-800">
                            {(equipment.length > 200 ? `${equipment.substring(0, 200)}...` : equipment)
                                .split('\n')
                                .map((line, idx) => (
                                    <span key={idx}>
                                        {line}
                                        <br />
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    {/* Mão de Obra */}
                    <div>
                        <div className="font-semibold text-sm mb-1">{t('workforce.title')}</div>
                        <div className="text-sm text-gray-800">
                            {(workforce.length > 200 ? `${workforce.substring(0, 200)}...` : workforce)
                                .split('\n')
                                .map((line, idx) => (
                                    <span key={idx}>
                                        {line}
                                        <br />
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    {/* Aprovar/Rejeitar */}
                    <div className="flex w-full sm:justify-end gap-2">
                        {rdo.rdoStatus === 'pendingApproval' && pUCanApprove && (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-gray-300 flex-1 sm:flex-none"
                                    onClick={handleReject}
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    {t('actions.reject')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 transition-colors flex-1 sm:flex-none"
                                    onClick={handleApprove}
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    {t('actions.approve')}
                                </Button>
                            </>
                        )}

                        {(rdo.rdoStatus === 'rejected' || rdo.rdoStatus === 'draft') && companyMemberCanApprove && (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 transition-colors flex-1 sm:flex-none"
                                    onClick={handleApprove}
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    {t('actions.approve')}
                                </Button>
                            </>
                        )}
                    </div>
                    {/* Tabs for Comentários/Ocorrências/Audit */}
                    <div className="rounded-xl px-2 pt-2 pb-4">
                        <Tabs defaultValue="comments" value={tab} onValueChange={(value) => setTab(value as 'comments' | 'audit')} className="w-full">
                            <TabsList className="w-full flex bg-transparent gap-2 mb-2 overflow-x-auto">
                                <TabsTrigger value="comments" className="flex-1 flex items-center justify-center gap-1">
                                    {t('tabs.comments')} <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 text-xs">{rdo.commentCount || 0}</span>
                                </TabsTrigger>
                                <TabsTrigger value="audit" className="flex-1 flex items-center justify-center gap-1">
                                    <span className="font-medium">{t('tabs.audit')}</span>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="comments" className="mt-2">
                                <CommentsSection
                                    rdoId={rdo.id || 0}
                                    initialComments={rdo.comments || []}
                                    projectId={projectId}
                                />
                            </TabsContent>
                            <TabsContent value="audit" className="mt-2">
                                {Array.isArray(rdo.audit) && rdo.audit.length > 0 ? (
                                    <div className="space-y-4">
                                        {rdo.audit.map((audit, index) => {
                                            return <AuditRow key={index} audit={audit as Approval} />;
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 py-4">{t('tabs.noAudit')}</div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>

            </Card>
        </>
    );
}

function AuditRow({ audit }: { audit: Approval }) {
    const [collapsed, setCollapsed] = useState(true);
    return (
        <div className="bg-gray-50 p-3 rounded-lg">
            <button
                type="button"
                className="w-full flex items-center justify-between mb-2 focus:outline-none"
                onClick={() => setCollapsed((c) => !c)}
                aria-expanded={!collapsed}
            >
                <div className="flex items-center gap-2">
                    <Badge variant={audit.action === 'approved' ? 'default' : 'destructive'}>
                        {audit.action}
                    </Badge>
                    <span className="text-xs text-gray-500">
                        {format(new Date(audit.date || ''), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                </div>
                <span className="ml-2 text-xs text-gray-400">
                    {collapsed ? (
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 9l6 6 6-6" /></svg>
                    ) : (
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M18 15l-6-6-6 6" /></svg>
                    )}
                </span>
            </button>
            {!collapsed && (
                <div className="text-[10px] text-gray-600 space-y-1 mt-2">
                    <p>{audit.userName}</p>
                    <p><span className="font-medium">IP:</span> {audit.ip_address}</p>
                    <p><span className="font-medium">Location:</span> {audit.geo_location}</p>
                    <p><span className="font-medium">Device:</span> {audit.device_type}</p>
                </div>
            )}
        </div>
    );
}
