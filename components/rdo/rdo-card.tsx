'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, Sun, CloudRain, EllipsisVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import CarouselMedia from '../feedPage/CarouselMedia';
import { RDO, RDOWithCommentsAndAudit, User } from '../types/strapi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { updateRDOStatus } from '../actions/rdo-action';
import { useLoading } from '../LoadingProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';
import { getClientInfo } from '@/components/approval/approval-audit';

export function RdoCard({ rdo }: { rdo: RDOWithCommentsAndAudit }) {
    const t = useTranslations('rdo.rdoCard');
    const [tab, setTab] = useState<'comments' | 'audit'>('comments');
    const { setIsLoading } = useLoading();
    const router = useRouter();

    const user = rdo.user as User;

    const projectName = typeof rdo.project === 'object' ? rdo.project.name : '';
    const projectDocumentId = typeof rdo.project === 'object' ? rdo.project.documentId : '';

    const handleApprove = async () => {
        if (!rdo.documentId) {
            toast.error(t('actions.approveError'));
            return;
        }
        try {
            setIsLoading(true);
            const clientInfo = await getClientInfo();
            const response = await updateRDOStatus(rdo.documentId || '', 'Approved', clientInfo);
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
        if (!rdo.documentId) {
            toast.error(t('actions.rejectError'));
            return;
        }
        try {
            setIsLoading(true);
            const clientInfo = await getClientInfo();
            const response = await updateRDOStatus(rdo.documentId || '', 'Rejected', clientInfo);
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
            case 'Approved':
                return t('approved');
            case 'Rejected':
                return t('rejected');
            default:
                return status;
        }
    };

    return (
        <>
            <Card className="bg-white shadow-sm border border-gray-100 p-6 space-y-4">
                <CardHeader className="flex flex-row items-start p-0 justify-between">
                    <div className="flex items-start gap-4">
                        <div>
                            <div className="text-xs">
                                <span className="text-muted-foreground mr-1">RDO</span>
                                <span className="font-bold text-gray-800">#{rdo.id}</span>
                            </div>
                            <div className="text-xs mt-1 flex items-center gap-1">
                                <span className="text-muted-foreground">{t('postedBy')}</span>
                                <span className="font-bold text-gray-800"> {user.firstName} {user.lastName}</span>
                            </div>
                            <div className="text-xs mt-1 flex items-center gap-1">
                                <span className="text-muted-foreground">{t('project')}</span>
                                <Link href={`/project/${projectDocumentId}`} className="font-bold underline text-gray-800"> {projectName}</Link>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {format(new Date(rdo?.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-end items-center gap-2">
                            <Button type="button" variant="ghost" className="text-gray-900 text-xl">
                                <EllipsisVertical className="w-5 h-5" />
                            </Button>
                        </div>
                        <Badge className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            rdo.rdoStatus === 'Approved' && 'bg-green-100 text-green-700',
                            rdo.rdoStatus === 'Rejected' && 'bg-red-100 text-red-700',
                            rdo.rdoStatus === 'pendingApproval' && 'bg-blue-100 text-blue-700',
                            rdo.rdoStatus === 'draft' && 'bg-gray-100 text-gray-700')
                        }>
                            {getStatusLabel(rdo.rdoStatus)}
                        </Badge>

                    </div>
                </CardHeader>
                <CardContent className="space-y-6 p-0">
                    {/* Condição Climática */}
                    <div>
                        <div className="font-semibold text-sm mb-4">{t('weather.title')}</div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            {[
                                { period: t('morning'), weather: rdo.weatherMorning },
                                { period: t('afternoon'), weather: rdo.weatherAfternoon },
                                { period: t('night'), weather: rdo.weatherNight }
                            ].map((weather) => {
                                const weatherData = Array.isArray(weather.weather) ? weather.weather[0] : weather.weather;

                                if (weatherData !== null && weatherData.condition !== null) {
                                    return (

                                        <Badge
                                            variant='outline'
                                            key={weather.period}
                                            className={`flex flex-col items-center gap-1 rounded-lg text-xs shadow-sm cursor-default ${!weatherData.workable
                                                && 'bg-red-50 text-red-900 hover:bg-red-100 hover:text-red-900'
                                                }`}
                                        >
                                            <div className='flex items-center gap-1'>
                                                {weather.period} {getWeatherIcon(weatherData.condition)}
                                            </div>
                                            <div className={`text-[10px] text-muted-foreground ${!weatherData.workable && 'text-red-900'}`}>
                                                {t(`weather.${weatherData.condition}`)} - {t(`weather.${weatherData.workable}`)}
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
                        <div className="text-sm text-gray-800 mb-2">{rdo.description}</div>

                    </div>
                    {/* Equipamentos Utilizados */}
                    <div>
                        <div className="font-semibold text-sm mb-1">{t('equipment.title')}</div>
                        <div className="text-sm text-gray-800">{equipment}</div>
                    </div>
                    {/* Mão de Obra */}
                    <div>
                        <div className="font-semibold text-sm mb-1">{t('workforce.title')}</div>
                        <div className="text-sm text-gray-800">{workforce}</div>
                    </div>
                    {/* Aprovar/Rejeitar */}
                    <div className="flex justify-end gap-2">
                        {rdo.rdoStatus === 'pendingApproval' && (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-gray-300"
                                    onClick={handleReject}
                                >
                                    {t('actions.reject')}
                                </Button>
                                <Button
                                    onClick={handleApprove}
                                >
                                    {t('actions.approve')}
                                </Button>
                            </>
                        )}
                    </div>
                    {/* Tabs for Comentários/Ocorrências/Audit */}
                    <div className="rounded-xl px-2 pt-2 pb-4">
                        <Tabs defaultValue="comments" value={tab} onValueChange={(value) => setTab(value as 'comments' | 'audit')} className="w-full">
                            <TabsList className="w-full flex bg-transparent gap-2 mb-2">
                                <TabsTrigger value="comments" className="flex-1 flex items-center justify-center gap-1">
                                    {t('tabs.comments')} <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 text-xs">{rdo.commentCount || 0}</span>
                                </TabsTrigger>
                                <TabsTrigger value="audit" className="flex-1 flex items-center justify-center gap-1">
                                    <span className="font-medium">{t('tabs.audit')}</span>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="comments" className="mt-2">
                                {Array.isArray(rdo.comments) && rdo.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {rdo.comments.map((comment, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-medium text-sm">
                                                        {typeof comment.user === 'object' ? comment.user.username : 'Unknown'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {format(new Date(comment.createdAt || ''), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 py-4">{t('tabs.noComments')}</div>
                                )}
                            </TabsContent>
                            <TabsContent value="audit" className="mt-2">
                                {Array.isArray(rdo.audit) && rdo.audit.length > 0 ? (
                                    <div className="space-y-4">
                                        {rdo.audit.map((audit, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={audit.action === 'Approved' ? 'default' : 'destructive'}>
                                                            {audit.action}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {format(new Date(audit.date || ''), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] text-gray-600 space-y-1">
                                                    <p>  {typeof audit.user === 'object' ? audit?.user?.firstName + ' ' + audit?.user?.lastName : ''}</p>
                                                    <p><span className="font-medium">IP:</span> {audit.ip_address}</p>
                                                    <p><span className="font-medium">Location:</span> {audit.geo_location}</p>
                                                    <p><span className="font-medium">Device:</span> {audit.device_type}</p>
                                                </div>
                                            </div>
                                        ))}
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