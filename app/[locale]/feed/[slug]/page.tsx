import React from 'react';
import ContainerApp from '@/components/Container-app';
import RDOCard from '@/components/feedPage/RDOCard';
import { RDO } from '@/components/types/strapi';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function FeedPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const t = await getTranslations('feed');
    // In a real app, fetch RDOs using projectId
    let rdos: RDO[] = [];

    try {
        const rdosResult = await fetchContentApi<RDO[]>(`rdos?populate=*&filters[project][$eq]=${slug}&sort=createdAt:desc`);
        if (rdosResult.success && rdosResult.data) {
            rdos = rdosResult.data;
        }
    } catch (error) {
        console.error('Error fetching RDOs:', error);
    }


    return (
        <ContainerApp form={false}>
            <div className="max-w-[600px] mx-auto w-full">
                {/* Feed */}
                <div className="flex-1 overflow-y-auto pb-20 space-y-10">
                    {rdos.length > 0 ? rdos.map((rdo) => (
                        <RDOCard key={rdo.id} rdo={rdo} />
                    )) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="text-muted-foreground text-lg mb-2">{t('empty.title')}</div>
                            <p className="text-sm text-muted-foreground/70 mb-4">{t('empty.description')}</p>
                            <Link href={`/rdo/create?project=${slug}`}>
                                <Button className="bg-primary hover:bg-primary/80">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('empty.createButton')}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </ContainerApp>
    );
};

