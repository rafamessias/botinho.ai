import { RdoEditForm } from '@/components/rdo/RdoEditForm';
import { RDO } from '@/components/types/strapi';
import ContainerApp from '@/components/Container-app';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { RestrictProjectUsers } from '@/components/shared/restrict-project-users';

export default async function EditRdoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let rdo: RDO = {} as RDO;
    try {
        const rdoFetch: any = await fetchContentApi<RDO>(`rdos/${slug}?populate=*`, {
            next: {
                revalidate: 0,
                tags: [`rdos:${slug}`]
            }
        });
        rdo = rdoFetch.data || {};
    } catch (error) {
        console.error('Failed to fetch RDO:', error);
    }

    return (
        <RestrictProjectUsers>
            <ContainerApp title={`Edit RDO #${rdo.id}`} showBackButton={true}>
                <RdoEditForm rdo={rdo} />
            </ContainerApp>
        </RestrictProjectUsers>
    );
}