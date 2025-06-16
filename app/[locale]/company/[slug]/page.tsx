import ContainerApp from "@/components/Container-app";
import { EditCompanyForm } from "@/components/company/edit-company-form";
import { fetchContentApi } from "@/components/actions/fetch-content-api";
import { Company, CompanyMemberDialog } from "@/components/types/strapi";
import { RecordNotFound } from "@/components/shared/record-not-found";
import { getTranslations } from "next-intl/server";
export default async function CompanyPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: 'company' });

    let company: Company | null;
    let companyMembers: CompanyMemberDialog[] | null;
    try {
        //get company
        const companyRecord: any = await fetchContentApi(`companies/${slug}?populate=*`);
        company = companyRecord?.data;

        //get company members
        const companyMembersRecord: any = await fetchContentApi(`company-members?populate=*&filters[company][$eq]=${company?.id}`);

        companyMembers = companyMembersRecord?.data;
    } catch (error) {
        company = null;
        companyMembers = [];
        console.error('Error fetching company', error);
    }

    return (
        <ContainerApp title={t('editTitle')} showBackButton={true}>
            {company ? (<EditCompanyForm company={company} companyMembers={companyMembers} />) : (
                <RecordNotFound />
            )}
        </ContainerApp>
    )
}