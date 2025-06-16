'use client'
import React from 'react';
import CarouselMedia from '@/components/feedPage/CarouselMedia';
import { MessageSquare, EllipsisVertical, Sun, Cloud, CloudRain } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import { RDO, StrapiImage, User } from '@/components/types/strapi';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const getWeatherIcon = (condition: string | null) => {
    if (!condition) return null;

    switch (condition) {
        case 'clear':
            return <Sun className="w-2 h-2" />;
        case 'cloudy':
            return <Cloud className="w-2 h-2" />;
        case 'rainy':
            return <CloudRain className="w-2 h-2" />;
        default:
            return null;
    }
};

const RDOCard = ({ rdo }: { rdo: RDO }) => {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    const t = useTranslations('rdo.rdoCard');
    const user = rdo.user as User;
    return (
        <Card className="p-6 space-y-4">
            <CardHeader className="p-0">
                <div className="flex items-start justify-between mb-1">
                    <div className="flex flex-col gap-1">
                        <div className="text-xs flex items-center gap-1">
                            <span className="text-muted-foreground">RDO</span>
                            <span className="font-bold text-gray-800">#{rdo.id}</span>
                        </div>
                        <div className="text-xs flex items-center gap-1">
                            <span className="text-muted-foreground">{t('postedBy')}</span>
                            <span className="font-bold text-gray-800">{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {new Date(rdo.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    <Button type="button" variant="ghost" className="text-gray-900 text-xl">
                        <EllipsisVertical className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex gap-2">
                    {[
                        { period: t('morning'), weather: rdo.weatherMorning },
                        { period: t('afternoon'), weather: rdo.weatherAfternoon },
                        { period: t('night'), weather: rdo.weatherNight }
                    ].map((weather) => {
                        const weatherData = Array.isArray(weather.weather) ? weather.weather[0] : weather.weather;

                        if (weatherData !== null && weatherData.condition !== null) {
                            return (
                                <TooltipProvider key={weather.period}>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <Badge
                                                variant='outline'
                                                key={weather.period}
                                                className={`flex items-center gap-1 rounded-lg text-xs shadow-sm cursor-default ${!weatherData.workable
                                                    && 'bg-red-50 text-red-900 hover:bg-red-100 hover:text-red-900'
                                                    }`}
                                            >
                                                {weather.period} {getWeatherIcon(weatherData.condition)}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{weatherData.workable ? t('workableConditions') : t('unworkableConditions')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        }
                        return null;
                    })}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="text-sm mb-4 text-gray-800">
                    {rdo.description.length > 200 ? `${rdo.description.substring(0, 200)}...` : rdo.description}
                </div>
                <CarouselMedia images={rdo.media as StrapiImage[] || []} />
            </CardContent>
            <CardFooter className="p-0">
                <div className="flex items-center justify-between text-xs text-gray-500 w-full">
                    <div className="flex gap-4">
                        <Link href={`/rdo/${rdo.documentId}?goback=${currentUrl}`} className="text-blue-600 hover:text-blue-700 transition-colors">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 transition-colors">
                                {t('details')}
                            </Button>
                        </Link>
                        <Link href={`/rdo/${rdo.documentId}?goback=${currentUrl}`} className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 transition-colors">
                                <MessageSquare className="w-4 h-4" /> {rdo.commentCount || 0}
                            </Button>
                        </Link>
                    </div>
                    <Badge className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        rdo.rdoStatus === 'approved' && 'bg-green-100 text-green-700',
                        rdo.rdoStatus === 'rejected' && 'bg-red-100 text-red-700',
                        rdo.rdoStatus === 'pendingApproval' && 'bg-blue-100 text-blue-700',
                        rdo.rdoStatus === 'draft' && 'bg-gray-100 text-gray-700')
                    }>{t(rdo.rdoStatus)}</Badge>
                </div>
            </CardFooter>
        </Card>
    );
};

export default RDOCard; 