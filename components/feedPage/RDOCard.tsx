'use client'
import React from 'react';
import CarouselMedia from '@/components/feedPage/CarouselMedia';
import { MessageSquare, EllipsisVertical, Sun, Cloud, CloudRain } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { RDO, StrapiImage, User } from '@/components/types/strapi';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

const getWeatherIcon = (condition: string) => {
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

const RDOCard = ({ rdo }: { rdo: RDO }) => {
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
                        { period: t('morning'), weather: rdo.wheatherMorning },
                        { period: t('afternoon'), weather: rdo.wheatherAfternoon },
                        { period: t('night'), weather: rdo.wheatherNight }
                    ].map((weather) => {
                        if (weather.weather !== null) {
                            return (
                                <TooltipProvider key={weather.period}>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                type="button"
                                                key={weather.period}
                                                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs shadow-sm ${weather.weather.workable
                                                    ? 'bg-gray-50 text-gray-900'
                                                    : 'bg-red-50 text-red-900 hover:bg-red-100 hover:text-red-900'
                                                    }`}
                                            >
                                                {weather.period} {getWeatherIcon(weather.weather.condition)}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{weather.weather.workable ? t('workableConditions') : t('unworkableConditions')}</p>
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
                <div className="text-sm mb-2 text-gray-800">
                    {rdo.description.length > 200 ? `${rdo.description.substring(0, 200)}...` : rdo.description}
                </div>
                <CarouselMedia images={rdo.media as StrapiImage[] || []} />
            </CardContent>
            <CardFooter className="p-0">
                <div className="flex items-center justify-between text-xs text-gray-500 w-full">
                    <div className="flex gap-4">
                        <Link href={`/rdo/${rdo.documentId}`} className="text-blue-600 hover:text-blue-700 transition-colors">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 transition-colors">
                                {t('details')}
                            </Button>
                        </Link>
                        <Link href={`/rdo/${rdo.documentId}`} className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 transition-colors">
                                <MessageSquare className="w-4 h-4" /> {rdo.comments?.length || 0}
                            </Button>
                        </Link>
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{rdo.status}</span>
                </div>
            </CardFooter>
        </Card>
    );
};

export default RDOCard; 