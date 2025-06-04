import ContainerApp from "@/components/Container-app";
import { getTranslations } from "next-intl/server";
import { EditCompanyForm } from "@/components/company/edit-company-form";
export default async function CompanyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    //const t = await getTranslations({ locale, namespace: 'homepage' });

    return (
        <ContainerApp>
            <div className="max-w-[600px] mx-auto w-full px-6 py-6 bg-white rounded-lg shadow-md">
                <EditCompanyForm />
            </div>
        </ContainerApp>
    )
}