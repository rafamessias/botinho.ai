import { RdoCard } from '@/components/rdo/rdo-card';
import { RDOWithCommentsAndAudit } from '@/components/types/strapi';
import ContainerApp from '@/components/Container-app';
import { prisma } from '@/prisma/lib/prisma';
import { notFound } from 'next/navigation';

export default async function RdoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const rdoId = parseInt(slug);

    if (isNaN(rdoId)) {
        notFound();
    }

    // TEMPORARY: Add delay to test loading skeleton
    //await new Promise(resolve => setTimeout(resolve, 300000)); // 3 second delay

    let rdo: RDOWithCommentsAndAudit = {} as RDOWithCommentsAndAudit;
    let projectName: string = '';

    try {
        // Fetch RDO with all related data using Prisma
        const rdoData = await prisma.rDO.findUnique({
            where: { id: rdoId },
            include: {
                user: {
                    include: {
                        avatar: true
                    }
                },
                project: {
                    include: {
                        company: true,
                        image: true
                    }
                },
                company: true,
                media: true,
                comments: {
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
                approvalAudits: {
                    include: {
                        user: {
                            include: {
                                avatar: true
                            }
                        }
                    },
                    orderBy: {
                        date: 'desc'
                    }
                }
            }
        });

        if (!rdoData) {
            notFound();
        }

        // Transform Prisma data to match the expected Strapi interface
        // Using type assertion to handle complex type transformations
        rdo = {
            id: rdoData.id,
            documentId: rdoData.id.toString(),
            user: rdoData.user as any,
            userName: rdoData.user.firstName || 'Unknown',
            project: rdoData.project as any,
            date: rdoData.date,
            description: rdoData.description,
            equipmentUsed: rdoData.equipmentUsed,
            workforce: rdoData.workforce,
            media: rdoData.media as any,
            rdoStatus: (rdoData.rdoStatus === 'approved' ? 'Approved' :
                rdoData.rdoStatus === 'rejected' ? 'Rejected' :
                    rdoData.rdoStatus) as any,
            weatherMorning: {
                condition: rdoData.weatherMorningCondition,
                workable: rdoData.weatherMorningWorkable
            },
            weatherAfternoon: {
                condition: rdoData.weatherAfternoonCondition,
                workable: rdoData.weatherAfternoonWorkable
            },
            weatherNight: {
                condition: rdoData.weatherNightCondition,
                workable: rdoData.weatherNightWorkable
            },
            commentCount: rdoData.commentCount,
            createdAt: rdoData.createdAt,
            updatedAt: rdoData.updatedAt,
            comments: rdoData.comments as any,
            audit: rdoData.approvalAudits as any
        };

        projectName = rdoData.project.name;

    } catch (error) {
        console.error('Failed to fetch RDO:', error);
        notFound();
    }

    return (
        <ContainerApp title={`#${rdo.id} - ${projectName}`} showBackButton={true} className="!px-0 sm:!px-8" divClassName="!rounded-none sm:!rounded-xl !shadow-none sm:!shadow-md border border-gray-100 sm:!border-none">
            <div className=" mx-auto w-full ">
                <RdoCard rdo={rdo} />
            </div>
        </ContainerApp>
    );
} 