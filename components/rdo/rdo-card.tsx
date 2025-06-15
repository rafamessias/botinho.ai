'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, MoreVertical, Cloud, Sun, CloudRain } from 'lucide-react';
import { cn } from '@/lib/utils';
import CarouselMedia from '../feedPage/CarouselMedia';
import { RDO, User } from '../types/strapi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

export function RdoCard({ rdo }: { rdo: RDO }) {
    const t = useTranslations('rdo.rdoCard');
    const [tab, setTab] = useState<'comments' | 'occurrences' | 'audit'>('occurrences');

    const user = rdo.user as User;

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
    const occurrences = [
        { id: 5, status: 'Aberto', title: 'Tamanho da piscina não está baten..', icon: '🚚', color: 'bg-gray-100', statusColor: 'bg-gray-100 text-gray-700' },
        { id: 4, status: 'Andamento', title: 'Nisi reprehenderi', icon: '👟', color: 'bg-rose-100', statusColor: 'bg-rose-100 text-rose-700' },
        { id: 3, status: 'Fechado', title: 'Product name', icon: '🔧', color: 'bg-sky-100', statusColor: 'bg-sky-100 text-sky-700' },
    ];

    const getStatusType = (status: RDO['rdoStatus']) => {
        switch (status) {
            case 'rejected':
                return 'danger';
            case 'pendingApproval':
                return 'warning';
            default:
                return undefined;
        }
    };

    const getStatusLabel = (status: RDO['rdoStatus']) => {
        switch (status) {
            case 'approved':
                return t('approved');
            case 'rejected':
                return t('rejected');
            case 'pendingApproval':
                return t('waitingApproval');
            default:
                return status;
        }
    };

    return (
        <Card className="bg-white shadow-sm border border-gray-100 py-4 px-2 space-y-4">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <div className="text-xs">
                        <span className="text-muted-foreground mr-1">RDO</span>
                        <span className="font-bold text-gray-800">#{rdo.id}</span>
                    </div>
                    <div className="text-xs mt-1 flex items-center gap-1">
                        <span className="text-muted-foreground">{t('postedBy')}</span>
                        <span className="font-bold text-gray-800"> {user.firstName} {user.lastName}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        {format(new Date(rdo?.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                </div>
                <div className="flex">
                    <Badge className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        rdo.rdoStatus === 'approved' && 'bg-green-100 text-green-700',
                        rdo.rdoStatus === 'rejected' && 'bg-red-100 text-red-700',
                        rdo.rdoStatus === 'pendingApproval' && 'bg-gray-100 text-gray-700')
                    }>
                        {getStatusLabel(rdo.rdoStatus)}
                    </Badge>

                </div>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <div className="flex gap-2 mt-2">
                    <Button variant="outline" className="flex-1 border-gray-300">{t('actions.reject')}</Button>
                    <Button className="flex-1">{t('actions.approve')}</Button>
                </div>
                {/* Tabs for Comentários/Ocorrências/Audit */}
                <div className="rounded-xl px-2 pt-2 pb-4">
                    <Tabs value={tab} onValueChange={(value) => setTab(value as 'comments' | 'occurrences' | 'audit')} className="w-full">
                        <TabsList className="w-full flex bg-transparent gap-2 mb-2">
                            <TabsTrigger value="comments" className="flex-1 flex items-center justify-center gap-1">
                                <MessageCircle className="h-4 w-4" /> {t('tabs.comments')} <span className="ml-1 bg-rose-100 text-rose-600 rounded-full px-2 text-xs">{rdo.commentCount || 0}</span>
                            </TabsTrigger>
                            <TabsTrigger value="occurrences" className="flex-1 flex items-center justify-center gap-1">
                                <span className="font-medium">{t('tabs.occurrences')}</span> <span className="ml-1 bg-rose-100 text-rose-600 rounded-full px-2 text-xs">9</span>
                            </TabsTrigger>
                            <TabsTrigger value="audit" className="flex-1 flex items-center justify-center gap-1">
                                <span className="font-medium">{t('tabs.audit')}</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="comments">
                            <div className="text-center text-gray-400 py-4">{t('tabs.notImplemented.comments')}</div>
                        </TabsContent>
                        <TabsContent value="occurrences">
                            <div className="space-y-2">
                                {occurrences.map((o) => (
                                    <div key={o.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100">
                                        <div className={cn('h-8 w-8 flex items-center justify-center rounded-lg', o.color)}>{o.icon}</div>
                                        <div className="flex-1">
                                            <div className="text-xs font-semibold">#{o.id}</div>
                                            <div className="text-xs text-gray-600 truncate max-w-[120px]">{o.title}</div>
                                        </div>
                                        <span className={cn('text-xs rounded-full px-2 py-0.5', o.statusColor)}>{o.status}</span>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="audit">
                            <div className="text-center text-gray-400 py-4">{t('tabs.notImplemented.audit')}</div>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>

        </Card>
    );
} 