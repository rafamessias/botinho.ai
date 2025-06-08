'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, CheckCircle, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import CarouselMedia from '../feedPage/CarouselMedia';
import { RDO } from '../types/strapi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

export function RdoCard({ rdo }: { rdo: RDO }) {
    const t = useTranslations('rdo.rdoCard');
    const [tab, setTab] = useState<'comments' | 'occurrences' | 'audit'>('occurrences');

    // Mock data for weather, equipment, workforce, and occurrences
    const weather = [
        { label: 'Manhã', icon: '☀️', desc: 'Claro, praticável', active: true, color: 'bg-white border border-gray-200 text-gray-700' },
        { label: 'Tarde', icon: '⛅', desc: 'Nublado, praticável', active: false, color: 'bg-white border border-gray-200 text-gray-700' },
        { label: 'Noite', icon: '🌧️', desc: 'Chuvoso, impraticável', active: false, color: 'bg-rose-100 border border-rose-200 text-rose-600' },
    ];
    const equipment = ['Caminhão Basculante', 'Betoneira'];
    const workforce = [
        '2 Ajudantes',
        '1 Mestre de Obra',
        '1 Engenheiro',
    ];
    const occurrences = [
        { id: 5, status: 'Aberto', title: 'Tamanho da piscina não está baten..', icon: '🚚', color: 'bg-gray-100', statusColor: 'bg-gray-100 text-gray-700' },
        { id: 4, status: 'Andamento', title: 'Nisi reprehenderi', icon: '👟', color: 'bg-rose-100', statusColor: 'bg-rose-100 text-rose-700' },
        { id: 3, status: 'Fechado', title: 'Product name', icon: '🔧', color: 'bg-sky-100', statusColor: 'bg-sky-100 text-sky-700' },
    ];

    const getStatusType = (status: RDO['status']) => {
        switch (status) {
            case 'rejected':
                return 'danger';
            case 'pending':
                return 'warning';
            default:
                return undefined;
        }
    };

    const getStatusLabel = (status: RDO['status']) => {
        switch (status) {
            case 'approved':
                return t('approved');
            case 'rejected':
                return t('rejected');
            case 'pending':
                return t('waitingApproval');
            default:
                return status;
        }
    };

    return (
        <Card className="bg-white shadow-sm border border-gray-100 py-4 px-2 space-y-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-4">
                <div>
                    <div className="text-xs">
                        <span className="text-muted-foreground">RDO</span>
                        <span className="font-bold text-primary">#{rdo.id}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                            {rdo?.user?.avatar ? (
                                <AvatarImage src={rdo.user.avatar.url} alt={rdo.user.username} />
                            ) : (
                                rdo?.user?.username?.slice(0, 2).toUpperCase()
                            )}
                        </Avatar>
                        <span>Postado por <b>{rdo?.user?.username}</b></span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        {format(new Date(rdo?.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        rdo.status === 'approved' && 'bg-green-100 text-green-700',
                        rdo.status === 'rejected' && 'bg-red-100 text-red-700',
                        rdo.status === 'pending' && 'bg-gray-100 text-gray-700')
                    }>
                        Esperando Aprovação
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Condição Climática */}
                <div>
                    <div className="font-semibold text-sm mb-1">Condição Climática</div>
                    <div className="flex gap-2">
                        {weather.map((w, i) => (
                            <div key={i} className={cn('flex flex-col items-center px-3 py-2 rounded-lg', w.color)}>
                                <span className="text-xs font-medium flex items-center gap-1">{w.label} <span>{w.icon}</span></span>
                                <span className="text-[11px] text-gray-500">{w.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Atividades Executadas */}
                <div >
                    {Array.isArray(rdo.media) && rdo.media.length > 0 && (
                        <CarouselMedia images={rdo.media.map(img => img.url)} />
                    )}
                    <div className="font-semibold text-sm mb-1 mt-4">Atividades Executadas</div>
                    <div className="text-sm text-gray-800 mb-2">{rdo.description}</div>

                </div>
                {/* Equipamentos Utilizados */}
                <div>
                    <div className="font-semibold text-sm mb-1">Equipamentos Utilizados</div>
                    <div className="text-sm text-gray-800">{equipment.join(', ')}</div>
                </div>
                {/* Mão de Obra */}
                <div>
                    <div className="font-semibold text-sm mb-1">Mão de Obra</div>
                    <div className="text-sm text-gray-800">{workforce.map((w, i) => <div key={i}>{w}</div>)}</div>
                </div>
                {/* Aprovar/Rejeitar */}
                <div className="flex gap-2 mt-2">
                    <Button variant="outline" className="flex-1 border-gray-300">Rejeitar</Button>
                    <Button className="flex-1">Aprovar</Button>
                </div>
                {/* Tabs for Comentários/Ocorrências/Audit */}
                <div className="bg-gray-50 rounded-xl px-2 pt-2 pb-4">
                    <Tabs value={tab} onValueChange={(value) => setTab(value as 'comments' | 'occurrences' | 'audit')} className="w-full">
                        <TabsList className="w-full flex bg-transparent gap-2 mb-2">
                            <TabsTrigger value="comments" className="flex-1 flex items-center justify-center gap-1">
                                <MessageCircle className="h-4 w-4" /> Comentários <span className="ml-1 bg-rose-100 text-rose-600 rounded-full px-2 text-xs">{rdo.comments?.length || 0}</span>
                            </TabsTrigger>
                            <TabsTrigger value="occurrences" className="flex-1 flex items-center justify-center gap-1">
                                <span className="font-medium">Ocorrências</span> <span className="ml-1 bg-rose-100 text-rose-600 rounded-full px-2 text-xs">9</span>
                            </TabsTrigger>
                            <TabsTrigger value="audit" className="flex-1 flex items-center justify-center gap-1">
                                <span className="font-medium">Auditoria de Aprovação</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="comments">
                            <div className="text-center text-gray-400 py-4">Comentários não implementados</div>
                        </TabsContent>
                        <TabsContent value="occurrences">
                            <Button className="w-full mb-2">Nova Ocorrência</Button>
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
                            <div className="text-center text-gray-400 py-4">Auditoria de aprovação não implementada</div>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>

        </Card>
    );
} 