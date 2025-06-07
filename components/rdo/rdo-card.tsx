'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, CheckCircle, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './status-badge';
import CarouselMedia from '../feedPage/CarouselMedia';
import { RDO } from '../types/strapi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslations } from 'next-intl';

export function RdoCard({ rdo }: { rdo: RDO }) {
    const t = useTranslations('rdo.rdoCard');

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
        <Card className="mb-4 px-2 py-4 space-y-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <div className="text-xs text-muted-foreground">RDO <span className="font-bold">#{rdo.id}</span></div>
                    <div className="text-xs text-muted-foreground">
                        {t('postedBy')} <span className="font-semibold">{rdo.user.username}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {format(new Date(rdo.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        {rdo.user.avatar ? (
                            <AvatarImage src={rdo.user.avatar.url} alt={rdo.user.username} />
                        ) : (
                            rdo.user.username.slice(0, 2).toUpperCase()
                        )}
                    </Avatar>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="flex gap-2 mb-2">
                    <StatusBadge label={t('morning')} />
                    <StatusBadge label={t('afternoon')} type={getStatusType(rdo.status)} />
                    <StatusBadge label={t('night')} type={getStatusType(rdo.status)} />
                </div>
                <div className="mb-2 text-sm">{rdo.description}</div>
                {rdo.image && (
                    <CarouselMedia images={[rdo.image.url]} />
                )}
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-0">
                <div className="flex items-center gap-4 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" /> {rdo.comments?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> {rdo.approvals?.length || 0}
                    </span>
                </div>
                <Badge
                    className={cn(
                        "px-3 py-1 text-xs font-medium",
                        rdo.status === 'approved' && "bg-green-100 text-green-700",
                        rdo.status === 'rejected' && "bg-red-100 text-red-700",
                        rdo.status === 'pending' && "bg-gray-100 text-gray-700"
                    )}
                >
                    {getStatusLabel(rdo.status)}
                </Badge>
            </CardFooter>
        </Card>
    );
} 