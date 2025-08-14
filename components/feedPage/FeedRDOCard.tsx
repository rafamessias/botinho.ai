'use client'
import React, { useEffect, useState } from 'react';
import CarouselMedia from '@/components/feedPage/CarouselMedia';
import { MessageSquare, Sun, Cloud, CloudRain, X, Check, Share2, Pencil } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { RDO, StrapiImage, User } from '@/components/types/strapi';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { updateRDOStatus } from '@/components/actions/rdo-action';
import { useLoading } from '@/components/LoadingProvider';
import { toast } from 'sonner';
import { getClientInfo } from '@/components/approval/approval-audit';
import { useUser } from '@/components/getUser';

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

const FeedRDOCard = ({ rdo }: { rdo: RDO }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setIsLoading } = useLoading();
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    const t = useTranslations('rdo.rdoCard');
    const userName = rdo.userName;
    const projectId = (typeof rdo.project === 'object' ? rdo.project.id : rdo.project) as number || 0;

    const { isCompanyUser, companyMemberCanApprove, projectUserCanApprove } = useUser();
    const [pUCanApprove, setPUCanApprove] = useState<boolean>(false);

    useEffect(() => {
        if (projectUserCanApprove) {
            setPUCanApprove(projectUserCanApprove(projectId));
        }
    }, [projectUserCanApprove, projectId]);

    const handleStatusUpdate = async (status: 'pendingApproval' | 'Approved' | 'Rejected') => {
        if (!rdo.documentId) return;

        try {
            setIsLoading(true);
            const clientInfo = await getClientInfo();
            const response = await updateRDOStatus(rdo.documentId, status, clientInfo);
            if (response.success) {
                toast.success(t(`actions.UpdatedSuccess`));
                rdo.rdoStatus = status;
                router.refresh();
            } else {
                toast.error(response.error || t(`actions.UpdatedError`));
            }
        } catch (error) {
            console.error('Error updating RDO status:', error);
            toast.error(t(`actions.UpdatedError`));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-6 space-y-4 !rounded-none sm:!rounded-xl !shadow-none sm:!shadow-sm border border-gray-100 sm:!border-none hover:!shadow-md transition-shadow">
            <CardHeader className="p-0 relative">
                <div className="absolute top-0 right-0 w-full flex justify-end items-center gap-2 -mt-2">
                    {isCompanyUser && (
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link href={`/rdo/edit/${rdo.documentId}?goback=${currentUrl}`} className="flex items-center gap-2">
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
                                    navigator.clipboard.writeText(`${window.location.origin}/rdo/view/${rdo.documentId}`);
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
                <div className="flex items-start justify-between mb-2">

                    <div className="flex flex-col gap-1">
                        <div className="text-xs flex items-center gap-1">
                            <span className="text-muted-foreground">RDO</span>
                            <span className="font-bold text-gray-800">#{rdo.id}</span>
                        </div>
                        <div className="text-xs flex items-center gap-1">
                            <span className="text-muted-foreground">{t('postedBy')}</span>
                            <span className="font-bold text-gray-800">{userName} </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {new Date(rdo.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                </div>
                <div className="flex gap-2">
                    {[
                        { period: t('morning'), weather: rdo.weatherMorning },
                        { period: t('afternoon'), weather: rdo.weatherAfternoon },
                        { period: t('night'), weather: rdo.weatherNight }
                    ].map((weather) => {
                        const weatherData = Array.isArray(weather.weather) ? weather.weather[0] : weather.weather;

                        if (weatherData !== null && weatherData.condition !== null && weatherData.condition !== "null") {
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
                <div className="-mx-6 sm:mx-0">
                    <CarouselMedia images={rdo.media as StrapiImage[] || []} className='rounded-none sm:rounded-lg border-none sm:border' />
                </div>
            </CardContent>
            <CardFooter className="p-0 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-gray-500 w-full">
                    <div className="flex gap-4">
                        <Link href={`/rdo/view/${rdo.documentId}?goback=${currentUrl}`} className="text-blue-600 hover:text-blue-700 transition-colors">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 transition-colors">
                                {t('details')}
                            </Button>
                        </Link>

                        <Link href={`/rdo/view/${rdo.documentId}?goback=${currentUrl}`} className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 transition-colors">
                                <MessageSquare className="w-4 h-4" /> {rdo.commentCount || 0}
                            </Button>
                        </Link>

                    </div>
                    <Badge className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        rdo.rdoStatus === 'Approved' && 'bg-green-100 text-green-700',
                        rdo.rdoStatus === 'Rejected' && 'bg-red-100 text-red-700',
                        rdo.rdoStatus === 'pendingApproval' && 'bg-blue-100 text-blue-700',
                        rdo.rdoStatus === 'draft' && 'bg-gray-100 text-gray-700')
                    }>{t(rdo.rdoStatus)}</Badge>
                </div>
                <div className="flex items-center justify-end w-full gap-2">
                    {(rdo.rdoStatus === 'draft' || rdo.rdoStatus === 'Rejected') && companyMemberCanApprove && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                                onClick={() => handleStatusUpdate('pendingApproval')}
                            >
                                <Check className="w-4 h-4 mr-1" />
                                {t('actions.approve')}
                            </Button>
                        </>
                    )}
                    {(rdo.rdoStatus === 'pendingApproval' && pUCanApprove) && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className=" transition-colors"
                                onClick={() => handleStatusUpdate('Rejected')}
                            >
                                <X className="w-4 h-4 mr-1" />
                                {t('actions.reject')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                                onClick={() => handleStatusUpdate('Approved')}
                            >
                                <Check className="w-4 h-4 mr-1" />
                                {t('actions.approve')}
                            </Button>
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};

export default FeedRDOCard; 