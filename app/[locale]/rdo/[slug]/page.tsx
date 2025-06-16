import { RdoCard } from '@/components/rdo/rdo-card';
import { RDO } from '@/components/types/strapi';
import ContainerApp from '@/components/Container-app';
import { fetchContentApi } from '@/components/actions/fetch-content-api';

export default async function RdoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    //console.log(slug);

    let rdo: RDO = {} as RDO;
    try {
        const rdosFetch: any = await fetchContentApi<RDO>(`rdos/${slug}?populate=*`);
        rdo = rdosFetch.data || {};

    } catch (error) {
        rdo = {} as RDO;
        console.error('Failed to fetch projects:', error);
    }

    return (

        <ContainerApp form={false}>
            <div className="max-w-[600px] mx-auto w-full">
                <RdoCard rdo={rdo} />
            </div>

        </ContainerApp>

    );
} 