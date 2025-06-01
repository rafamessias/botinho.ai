import { CreateCompanyForm } from '@/components/company/create-company-form';
import ContainerApp from '@/components/Container-app';
export default function CreateCompanyPage() {
    return (
        <ContainerApp>
            <div className="max-w-[600px] mx-auto w-full px-6 py-6 bg-white rounded-lg shadow-md">
                <CreateCompanyForm />
            </div>
        </ContainerApp>
    );
} 