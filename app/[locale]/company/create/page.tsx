import { CreateCompanyForm } from '@/components/company/create-company-form';
import ContainerApp from '@/components/Container-app';
import { getTranslations } from 'next-intl/server';
import { RestrictProjectUsers } from '@/components/shared/restrict-project-users';

export default async function CreateCompanyPage() {
    const t = await getTranslations('company');
    return (
        <RestrictProjectUsers>
            <ContainerApp title={t('createTitle')} showBackButton={true}>
                <CreateCompanyForm />
            </ContainerApp>
        </RestrictProjectUsers>
    );
} 