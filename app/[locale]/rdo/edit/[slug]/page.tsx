import { RdoEditForm } from '@/components/rdo/RdoEditForm';
import { RDO } from '@/components/types/prisma';
import ContainerApp from '@/components/Container-app';
import { getRDOById } from '@/components/actions/rdo-action';
import { RestrictProjectUsers } from '@/components/shared/restrict-project-users';
import { notFound } from 'next/navigation';

export default async function EditRdoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Convert slug to number for Prisma query
    const rdoId = parseInt(slug, 10);

    if (isNaN(rdoId)) {
        notFound();
    }

    let rdo: RDO = {} as RDO;
    try {
        const rdoResponse = await getRDOById(rdoId);

        if (!rdoResponse.success || !rdoResponse.data) {
            console.error('Failed to fetch RDO:', rdoResponse.error);
            notFound();
        }

        rdo = rdoResponse.data;
    } catch (error) {
        console.error('Failed to fetch RDO:', error);
        notFound();
    }

    return (
        <RestrictProjectUsers>
            <ContainerApp title={`Edit RDO #${rdo.id}`} showBackButton={true}>
                <RdoEditForm rdo={rdo} />
            </ContainerApp>
        </RestrictProjectUsers>
    );
}