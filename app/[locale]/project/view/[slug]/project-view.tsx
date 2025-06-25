'use client';

import { Project, StrapiImage, RDO, User } from '@/components/types/strapi';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, File, Construction, Image as ImageIcon, Pencil, EyeIcon, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { TooltipContent, TooltipTrigger, TooltipProvider, Tooltip } from '@/components/ui/tooltip';
import { usePathname, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function InfoField({ label, value }: { label: string; value: string | undefined | null }) {
    if (!value) return null;
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-500">{label}</h2>
            <p className="text-base text-gray-800">{value}</p>
        </div>
    );
}

export default function ProjectView({ project, rdos }: { project: Project; rdos: RDO[] }) {
    const t = useTranslations('project.view');
    const [tab, setTab] = useState('rdos');

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    const dummyIncidents = [
        { id: 1, title: 'Material delivery delay', status: 'Open' },
        { id: 2, title: 'Safety violation', status: 'Closed' },
    ];

    const dummyMedia = [
        { id: 1, url: 'https://via.placeholder.com/150', type: 'image' },
        { id: 2, url: 'https://via.placeholder.com/150', type: 'image' },
        { id: 3, url: 'https://via.placeholder.com/150', type: 'image' },
        { id: 4, url: 'https://via.placeholder.com/150', type: 'image' },
    ];

    const dummyUsers = [
        { id: 1, name: 'John Doe', role: 'Engineer' },
        { id: 2, name: 'Jane Smith', role: 'Architect' },
    ];

    const getStatusLabel = (status: RDO['rdoStatus']) => {
        switch (status) {
            case 'draft':
                return t('rdoStatus.draft');
            case 'pendingApproval':
                return t('rdoStatus.pendingApproval');
            case 'Approved':
                return t('rdoStatus.approved');
            case 'Rejected':
                return t('rdoStatus.rejected');
            default:
                return status;
        }
    };

    const getStatusVariant = (status: RDO['rdoStatus']) => {
        switch (status) {
            case 'Approved':
                return 'default';
            case 'Rejected':
                return 'destructive';
            case 'pendingApproval':
                return 'secondary';
            case 'draft':
                return 'outline';
            default:
                return 'outline';
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="absolute top-0 left-0 w-full h-48 rounded-t-lg overflow-hidden">
                {project.image ? (
                    <Image
                        src={(project.image as StrapiImage).url}
                        alt={project.name}
                        layout="fill"
                        objectFit="cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
            <div className=" w-full flex justify-end items-center gap-2 mt-[198px]">
                <TooltipProvider >
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Link href={`/project/edit/${project.documentId}?goback=${currentUrl}`} className="absolute flex items-center gap-2">
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
            </div>

            <div className="flex flex-col gap-6 px-4 pb-4 bg-white rounded-lg ">
                <InfoField label={t('name')} value={project.name} />
                <InfoField label={t('description')} value={project.description} />
                <InfoField label={t('address')} value={project.address} />
            </div>

            <div className="rounded-xl">
                <Tabs value={tab} onValueChange={setTab} className="w-full relative" orientation="horizontal">
                    <TabsList className="absolute flex flex-row justify-stretch w-full bg-transparent overflow-x-auto">
                        <TabsTrigger value="rdos" className="flex items-center gap-2">
                            <Construction className="w-4 h-4" /> {t('tabs.rdos')}
                        </TabsTrigger>
                        <TabsTrigger value="incidents" className="flex items-center gap-2">
                            <File className="w-4 h-4" /> {t('tabs.incidents')}
                        </TabsTrigger>
                        <TabsTrigger value="media" className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> {t('tabs.media')}
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4" /> {t('tabs.users')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rdos" className="mt-14">
                        <div className="space-y-4">
                            {rdos.length > 0 ? (
                                rdos.map(rdo => {
                                    const user = rdo.user as User;
                                    const media = rdo.media as StrapiImage[];
                                    const firstImage = media && media.length > 0 ? media[0] : null;

                                    return (
                                        <Card key={rdo.id} className="border border-gray-100 px-2 py-1 hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-4">

                                                    {/* RDO info */}
                                                    <div className="relative flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-base">RDO #{rdo.id}</h3>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {t('postedBy')} {user?.firstName} {user?.lastName}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {format(new Date(rdo.date), "dd/MM/yyyy", { locale: ptBR })}
                                                                </p>
                                                            </div>
                                                            <Badge variant={getStatusVariant(rdo.rdoStatus)}>
                                                                {getStatusLabel(rdo.rdoStatus)}
                                                            </Badge>
                                                        </div>

                                                        {/* Description preview */}
                                                        {rdo.description && (
                                                            <p className="text-sm py-2 text-gray-700 line-clamp-2">
                                                                {rdo.description}
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
                                                            <Link href={`/rdo/view/${rdo.documentId}`}>
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
                                })
                            ) : (
                                <div className="text-center text-gray-400 py-4">{t('tabs.noRdos')}</div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="incidents" className="mt-10">
                        <div className="space-y-4">
                            {dummyIncidents.length > 0 ? (
                                dummyIncidents.map(incident => (
                                    <Card key={incident.id}>
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <p className="font-semibold">{incident.title}</p>
                                            <Badge>{incident.status}</Badge>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-4">{t('tabs.noIncidents')}</div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="media" className="mt-10">
                        {dummyMedia.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {dummyMedia.map(media => (
                                    <div key={media.id} className="relative aspect-square">
                                        <Image src={media.url} alt="media" layout="fill" className="rounded-lg object-cover" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-4">{t('tabs.noMedia')}</div>
                        )}
                    </TabsContent>

                    <TabsContent value="users" className="mt-10">
                        <div className="space-y-4">
                            {dummyUsers.length > 0 ? (
                                dummyUsers.map(user => (
                                    <Card key={user.id}>
                                        <CardContent className="p-4">
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.role}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-4">{t('tabs.noUsers')}</div>
                            )}
                        </div>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
} 