'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { MessageCircle, CheckCircle, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './status-badge';
import { useTranslations } from 'next-intl';

export function RdoCard({
    id,
    user,
    date,
    description,
    image,
    status,
    statusType,
    comments,
    approvals,
    awaiting,
    locale,
    messages,
}: {
    id: string;
    user: { username: string; avatar: string };
    date: string;
    description: string;
    image: string;
    status: string;
    statusType: 'warning' | 'danger' | undefined;
    comments: number;
    approvals: number;
    awaiting: boolean;
    locale: string;
    messages: any;
}) {

    const t = useTranslations('rdo.rdoCard');

    return (
        <Card className="mb-4 px-2 py-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <div className="text-xs text-muted-foreground">ID<span className="font-bold">#{id}</span></div>
                    <div className="text-xs text-muted-foreground">
                        {t('postedBy')} <span className="font-semibold">{user.username}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{date}</div>
                </div>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        AV
                    </Avatar>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="flex gap-2 mb-2">
                    <StatusBadge label={t('morning')} />
                    <StatusBadge label={t('afternoon')} type={statusType === 'warning' ? 'warning' : undefined} />
                    <StatusBadge label={t('night')} type={statusType === 'danger' ? 'danger' : undefined} />
                </div>
                <div className="mb-2 text-sm">{description}</div>
                <div className="relative w-full h-48 rounded-md overflow-hidden mb-2">
                    IMAGE
                </div>
                {/* Carousel dots mock */}
                <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={cn('h-2 w-2 rounded-full', i === 1 ? 'bg-primary' : 'bg-gray-200')} />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-0">
                <div className="flex items-center gap-4 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {comments}</span>
                    <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> {approvals}</span>
                </div>
                <Badge className="bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium">{t('waitingApproval')}</Badge>
            </CardFooter>
        </Card>
    );
} 