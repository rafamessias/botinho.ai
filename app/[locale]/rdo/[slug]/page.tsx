import { RdoCard } from '@/components/rdo/rdo-card';
import { getTranslations } from 'next-intl/server';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { RDO } from '@/components/types/strapi';

export default async function RdoPage() {

    let rdos: RDO[] = [];
    try {
        const rdosFetch: any = await fetchContentApi('rdos?populate=*');
        rdos = rdosFetch.data || [];
        console.log(rdos);
    } catch (error) {
        console.error('Failed to fetch projects:', error);
    }

    return (

        <main className="min-h-screen flex flex-col items-center justify-start">
            <div className="md:w-[620px] min-w-[320px]">
                {rdos.map(item => (
                    <RdoCard key={item.id} rdo={item} />
                ))}
            </div>

        </main>

    );
} 