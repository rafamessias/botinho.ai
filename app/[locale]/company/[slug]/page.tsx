import ContainerApp from "@/components/Container-app";
import { EditCompanyForm } from "@/components/company/edit-company-form";
import { Company, CompanyMemberDialog, FileImage } from "@/components/types/prisma";
import { RecordNotFound } from "@/components/shared/record-not-found";
import { getTranslations } from "next-intl/server";
import { requireSession } from "@/components/actions/check-session";
import { prismaWithCompany } from "@/components/actions/prisma-with-company";

// Force dynamic rendering since this page uses authentication
export const dynamic = 'force-dynamic';

export default async function CompanyPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: 'company' });

    // TEMPORARY: Add delay to test loading skeleton
    //await new Promise(resolve => setTimeout(resolve, 300000)); // 3 second delay

    await requireSession();

    let company: Company | null;
    let companyMembers: CompanyMemberDialog[] | null;
    try {
        // Get company with relations
        const companyRecord: any = await prismaWithCompany.company.findUnique({
            where: { id: parseInt(slug) },
            include: {
                owner: true,
                logo: true,
                coverImage: true,
                members: {
                    include: {
                        user: {
                            include: {
                                avatar: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                projects: true,
                users: true
            }
        });

        if (!companyRecord) {
            company = null;
            companyMembers = [];
        } else {
            // Transform company data to match Strapi interface
            company = {
                id: companyRecord.id,
                name: companyRecord.name,
                documentType: companyRecord.documentType,
                document: companyRecord.document,
                zipCode: companyRecord.zipCode,
                state: companyRecord.state,
                city: companyRecord.city,
                address: companyRecord.address,
                owner: {
                    id: companyRecord.owner.id,
                    email: companyRecord.owner.email,
                    firstName: companyRecord.owner.firstName,
                    lastName: companyRecord.owner.lastName || undefined,
                    phone: companyRecord.owner.phone || undefined,
                    type: companyRecord.owner.type,
                    language: companyRecord.owner.language,
                    confirmed: companyRecord.owner.confirmed || undefined,
                    blocked: companyRecord.owner.blocked || undefined,
                    createdAt: companyRecord.owner.createdAt,
                    updatedAt: companyRecord.owner.updatedAt
                },
                logo: companyRecord.logo as FileImage,
                activeProjectCount: companyRecord.activeProjectCount,
                projectCount: companyRecord.projectCount,
                createdAt: companyRecord.createdAt,
                updatedAt: companyRecord.updatedAt,
                members: companyRecord.members.map((member: any) => ({
                    id: member.id,
                    company: companyRecord.id,
                    user: member.user.id,
                    role: member.isAdmin ? 'admin' : 'member',
                    isAdmin: member.isAdmin,
                    canPost: member.canPost,
                    canApprove: member.canApprove,
                    isOwner: member.isOwner,
                    createdAt: member.createdAt,
                    updatedAt: member.updatedAt
                })),
                projects: companyRecord.projects.map((project: any) => ({
                    id: project.id,
                    active: project.active,
                    name: project.name,
                    description: project.description || '',
                    address: project.address || '',
                    projectStatus: project.projectStatus,
                    company: companyRecord.id,
                    createdAt: project.createdAt,
                    updatedAt: project.updatedAt
                })),
                users: companyRecord.users.map((user: any) => ({
                    id: user.id,
                    username: user.email,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName || undefined,
                    phone: user.phone || undefined,
                    type: user.type,
                    language: user.language,
                    confirmed: user.confirmed || undefined,
                    blocked: user.blocked || undefined,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }))
            };

            // Transform company members to CompanyMemberDialog format
            companyMembers = companyRecord.members.map((member: any) => ({
                id: member.id,
                name: `${member.user.firstName} ${member.user.lastName || ''}`.trim(),
                firstName: member.user.firstName,
                lastName: member.user.lastName || undefined,
                email: member.user.email,
                phone: member.user.phone || '',
                avatar: member.user.avatar?.url || '',
                user: {
                    id: member.user.id,
                    username: member.user.email,
                    email: member.user.email,
                    firstName: member.user.firstName,
                    lastName: member.user.lastName || undefined,
                    phone: member.user.phone || undefined,
                    type: member.user.type,
                    language: member.user.language,
                    confirmed: member.user.confirmed || undefined,
                    blocked: member.user.blocked || undefined,
                    createdAt: member.user.createdAt,
                    updatedAt: member.user.updatedAt
                },
                isAdmin: member.isAdmin,
                canPost: member.canPost,
                canApprove: member.canApprove,
                isOwner: member.isOwner
            }));
        }
    } catch (error) {
        company = null;
        companyMembers = [];
        console.error('Error fetching company', error);
    }

    return (
        <ContainerApp title={t('editTitle')} showBackButton={true}>
            {company ? (<EditCompanyForm company={company} companyMembers={companyMembers} locale={locale} />) : (
                <RecordNotFound />
            )}
        </ContainerApp>
    )
}