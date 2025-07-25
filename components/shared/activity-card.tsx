'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { StrapiImage, User } from '@/components/types/strapi';

interface ActivityCardProps {
    id: number;
    documentId: string;
    type: 'rdo' | 'incident';
    title: string;
    description?: string;
    date: Date;
    status: string;
    priority?: string | number;
    user: User;
    userName?: string;
    media?: StrapiImage[];
    getStatusLabel: (status: any) => string;
    getStatusVariant: (status: any) => "default" | "secondary" | "destructive" | "outline";
    getPriorityLabel?: (priority: any) => string;
    getPriorityVariant?: (priority: any) => "default" | "secondary" | "destructive" | "outline";
    t: (key: string) => string;
}

export default function ActivityCard({
    id,
    documentId,
    type,
    title,
    description,
    date,
    status,
    priority,
    user,
    userName,
    media,
    getStatusLabel,
    getStatusVariant,
    getPriorityLabel,
    getPriorityVariant,
    t
}: ActivityCardProps) {
    return (
        <Card className="border border-gray-100 px-2 py-1 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    {/* Activity info */}
                    <div className="relative flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-muted-foreground">
                                    {title} <span className="font-semibold text-gray-700">#{id}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {t('postedBy')} <span className="font-semibold text-gray-700">{userName}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {date.toLocaleDateString('pt-BR', {
                                        weekday: 'long',
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Badge variant={getStatusVariant(status)}>
                                    {getStatusLabel(status)}
                                </Badge>
                                {priority && getPriorityLabel && getPriorityVariant && (
                                    <Badge variant={getPriorityVariant(String(priority))}>
                                        {getPriorityLabel(String(priority))}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Description preview */}
                        {description && (
                            <p className="text-sm py-2 text-gray-700 line-clamp-2">
                                {description}
                            </p>
                        )}

                        {/* Media thumbnails */}
                        {media && media.length > 0 && (
                            <div className="mt-2 flex items-center gap-1">
                                {media.slice(0, 5).map((image, index) => (
                                    <div key={index} className="relative w-8 h-8 rounded overflow-hidden">
                                        <Image
                                            src={image.url}
                                            alt={`Media ${index + 1}`}
                                            fill
                                            sizes="32px"
                                            priority={true}
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                                {media.length > 5 && (
                                    <span className="text-xs text-gray-500 ml-1">
                                        +{media.length - 5}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="absolute right-0 bottom-0 flex justify-end items-center gap-2">
                            <Link href={`/${type}/view/${documentId}`}>
                                <Button variant="outline" size="icon">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 