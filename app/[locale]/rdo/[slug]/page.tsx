import Header from '@/components/header';
import { RdoCard } from '@/components/rdo/rdo-card';
import { BottomNav } from '@/components/rdo/bottom-nav';
import { getTranslations } from 'next-intl/server';
import { client } from '@/lib/strapi';


export default async function RdoPage({ params }: { params: { locale: string, slug: string } }) {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: 'homepage' });

    let rdos: any[] = [];
    try {
        const rdoItens = client.collection('rdos?populate=*')
        const rdosData = await rdoItens.find()
        rdos = rdosData.data;
    } catch (error) {
        console.error('Failed to fetch projects:', error);
    }

    return (

        <main className="min-h-screen flex flex-col items-center justify-start">
            <div className="md:w-[620px] min-w-[320px]">
                {rdos.map(item => (
                    <RdoCard key={item.id} {...item} />
                ))}
            </div>

        </main>

    );
} 