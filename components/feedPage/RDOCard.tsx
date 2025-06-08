'use client'
import React from 'react';
import CarouselMedia from './CarouselMedia';
import { MessageSquare, EllipsisVertical, Sun, Cloud, CloudRain } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { RDO } from '../types/strapi';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

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
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between mb-1">
                <div className="flex flex-col gap-1">
                    <div className="text-xs flex items-center gap-1">
                        <span className="text-muted-foreground">RDO</span>
                        <span className="font-bold text-gray-800">#{rdo.id}</span>
                    </div>
                    <div className="text-xs flex items-center gap-1">
                        <span className="text-muted-foreground">Postado por</span>
                        <span className="font-bold text-gray-800">{rdo.user.firstName} {rdo.user.lastName}</span>

                    </div>
                    <div className="text-xs text-gray-400">
                        {new Date(rdo.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                </div>
                <Button type="button" variant="ghost" className="text-gray-400 text-xl">
                    <EllipsisVertical className="w-5 h-5" />
                </Button>
            </div>
            <div className="flex gap-2">
                {[
                    { period: 'Manhã', weather: rdo.wheatherMorning },
                    { period: 'Tarde', weather: rdo.wheatherAfternoon },
                    { period: 'Noite', weather: rdo.wheatherNight }
                ].map((weather) => {
                    if (weather.weather !== null) {
                        return (
                            <TooltipProvider>
                                <Tooltip key={weather.period}>
                                    <TooltipTrigger asChild>
                                        <span
                                            key={weather.period}
                                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs shadow-sm ${weather.weather.workable
                                                ? 'bg-green-50 text-green-900'
                                                : 'bg-red-50 text-red-900'
                                                }`}
                                        >
                                            {weather.period} {getWeatherIcon(weather.weather.condition)}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{weather.weather.workable ? 'Condições de trabalho adequadas' : 'Condições de trabalho inadequadas'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    }
                    return null;
                })}
            </div>
            <div className="text-sm mb-2 text-gray-800">
                {rdo.description}
            </div>
            <CarouselMedia images={rdo.media || []} />
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex gap-4">
                    <Link href={`/rdo/${rdo.documentId}`} className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 transition-colors">
                            Detalhes
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
        </div>
    );
};

export default RDOCard; 