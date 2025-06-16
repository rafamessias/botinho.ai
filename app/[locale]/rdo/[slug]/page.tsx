import { RdoCard } from '@/components/rdo/rdo-card';
import { RDO } from '@/components/types/strapi';
import ContainerApp from '@/components/Container-app';
import { fetchContentApi } from '@/components/actions/fetch-content-api';

export default async function RdoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let rdo: RDO = {} as RDO;
    let projectName: string = '';
    try {
        const rdosFetch: any = await fetchContentApi<RDO>(`rdos/${slug}?populate=*`);
        rdo = rdosFetch.data || {};
        if (typeof rdo.project === 'object') {
            projectName = rdo.project?.name || '';
        }
    } catch (error) {
        rdo = {} as RDO;
        console.error('Failed to fetch projects:', error);
    }

    return (

        <ContainerApp form={false} title={`#${rdo.id} - ${projectName}`} showBackButton={true}>
            <div className="max-w-[600px] mx-auto w-full">
                <RdoCard rdo={rdo} />
            </div>

        </ContainerApp>

    );
} 