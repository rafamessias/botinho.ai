import { RdoCard } from '@/components/rdo/rdo-card';
import { Approval, Comment, RDO, RDOWithCommentsAndAudit } from '@/components/types/strapi';
import ContainerApp from '@/components/Container-app';
import { fetchContentApi } from '@/components/actions/fetch-content-api';

export default async function RdoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let rdo: RDOWithCommentsAndAudit = {} as RDOWithCommentsAndAudit;
    let projectName: string = '';
    try {
        const rdosFetch: any = await fetchContentApi<RDO>(`rdos/${slug}?populate=*`, {
            next: {
                revalidate: 300,
                tags: [`rdos:${slug}`]
            }
        });
        rdo = rdosFetch.data || {};
        if (typeof rdo.project === 'object') {
            projectName = rdo.project?.name || '';
        }

        const commentsFetch: any = await fetchContentApi<Comment[]>(`comments?filters[rdo][$eq]=${rdo.id}`, {
            next: {
                revalidate: 300,
                tags: [`comments:${slug}`]
            }
        });
        const comments = commentsFetch.data || [];

        const auditFetch: any = await fetchContentApi<Approval[]>(`approval-audits?populate[user][fields][0]=firstName&populate[user][fields][1]=lastName&filters[rdo][$eq]=${rdo.id}&sort[0]=date:desc`, {
            next: {
                revalidate: 300,
                tags: [`approval-audits:${slug}`]
            }
        });
        const audit = auditFetch.data || [];

        rdo = {
            ...rdo,
            comments,
            audit
        };

    } catch (error) {
        rdo = {} as RDOWithCommentsAndAudit;
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