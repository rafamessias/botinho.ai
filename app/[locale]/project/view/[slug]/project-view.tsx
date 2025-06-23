'use client';

import { Project, StrapiImage } from '@/components/types/strapi';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, File, Construction, Image as ImageIcon } from 'lucide-react';

function InfoField({ label, value }: { label: string; value: string | undefined | null }) {
    if (!value) return null;
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-500">{label}</h2>
            <p className="text-base text-gray-800">{value}</p>
        </div>
    );
}

export default function ProjectView({ project }: { project: Project }) {
    const t = useTranslations('project.view');
    const [tab, setTab] = useState('rdos');

    const dummyRdos = [
        { id: 1, title: 'RDO #001', date: '2023-10-26', status: 'Approved' },
        { id: 2, title: 'RDO #002', date: '2023-10-27', status: 'Pending' },
    ];

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

    return (
        <div className="flex flex-col gap-8">
            {project.image && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                        src={(project.image as StrapiImage).url}
                        alt={project.name}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            )}
            <div className="flex flex-col gap-6 p-4 bg-white rounded-lg ">
                <InfoField label={t('name')} value={project.name} />
                <InfoField label={t('description')} value={project.description} />
                <InfoField label={t('address')} value={project.address} />
            </div>

            <div className="rounded-xl">
                <Tabs value={tab} onValueChange={setTab} className="w-fullt">
                    <TabsList className="grid w-full grid-cols-4 bg-transparent">
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
                            <User className="w-4 h-4" /> {t('tabs.users')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rdos" className="mt-4">
                        <div className="space-y-4">
                            {dummyRdos.length > 0 ? (
                                dummyRdos.map(rdo => (
                                    <Card key={rdo.id}>
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{rdo.title}</p>
                                                <p className="text-sm text-gray-500">{rdo.date}</p>
                                            </div>
                                            <Badge>{rdo.status}</Badge>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-4">{t('tabs.noRdos')}</div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="incidents" className="mt-4">
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

                    <TabsContent value="media" className="mt-4">
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

                    <TabsContent value="users" className="mt-4">
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