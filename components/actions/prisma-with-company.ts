// components/actions/prisma-with-company.ts
import { prisma } from "@/prisma/lib/prisma";
import { auth } from "@/app/auth";

async function getCurrentUserCompanyId(): Promise<{ companyId: number | null, projectId: string | null }> {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error("User not authenticated");
    }

    const companyId = session.user.company ? parseInt(session.user.company) : null;
    const projectId = session.user.projectId || null;

    // Return both number and string
    return { companyId: companyId, projectId: projectId };
}

function addCompanyOrProjectToWhere(where: any, companyId: number | null, projectId: string | null) {
    const newWhere = { ...where };
    if (companyId && companyId !== 0) {
        newWhere.companyId = companyId;
    } else if (projectId) {
        // projectId can be a string or an array of strings
        newWhere.projectId = Array.isArray(projectId) ? { in: projectId } : { in: [projectId] };
    }
    return newWhere;
}

export const prismaWithCompany = {
    approvalAudit: {
        async create(data: any) {
            const { companyId } = await getCurrentUserCompanyId();
            return prisma.approvalAudit.create({
                data: { ...data, companyId }
            });
        },
        async findUnique(args: any) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.approvalAudit.findUnique({
                ...args,
                where
            });
        },
        async findMany(args: any = {}) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.approvalAudit.findMany({
                ...args,
                where
            });
        }
    },
    file: {
        async create(data: any) {
            const { companyId } = await getCurrentUserCompanyId();
            return prisma.file.create({
                data: { ...data, companyId }
            });
        },
        async findUnique(args: any) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.file.findUnique({
                ...args,
                where
            });
        },
        async findMany(args: any = {}) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.file.findMany({
                ...args,
                where
            });
        }
    },
    projectUser: {
        async create(data: any) {
            const { companyId } = await getCurrentUserCompanyId();
            return prisma.projectUser.create({
                data: { ...data, companyId }
            });
        },
        async findUnique(args: any) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.projectUser.findUnique({
                ...args,
                where
            });
        },
        async findMany(args: any = {}) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.projectUser.findMany({
                ...args,
                where
            });
        }
    },
    project: {
        async create(data: any) {
            const { companyId } = await getCurrentUserCompanyId();
            return prisma.project.create({
                data: { ...data, companyId }
            });
        },
        async findUnique(args: any) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.project.findUnique({
                ...args,
                where
            });
        },
        async findMany(args: any = {}) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.project.findMany({
                ...args,
                where
            });
        }
    },
    incident: {
        async create(data: any) {
            const { companyId } = await getCurrentUserCompanyId();
            return prisma.incident.create({
                data: { ...data, companyId }
            });
        },
        async findUnique(args: any) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.incident.findUnique({
                ...args,
                where
            });
        },
        async findMany(args: any = {}) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.incident.findMany({
                ...args,
                where
            });
        }
    },
    rdo: {
        async create(data: any) {
            const { companyId } = await getCurrentUserCompanyId();
            return prisma.rDO.create({
                data: { ...data, companyId }
            });
        },
        async findUnique(args: any) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.rDO.findUnique({
                ...args,
                where
            });
        },
        async findMany(args: any = {}) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.rDO.findMany({
                ...args,
                where
            });
        }
    },
    comment: {
        async create(data: any) {
            const { companyId } = await getCurrentUserCompanyId();
            return prisma.comment.create({
                data: { ...data, companyId }
            });
        },
        async findUnique(args: any) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.comment.findUnique({
                ...args,
                where
            });
        },
        async findMany(args: any = {}) {
            const { companyId, projectId } = await getCurrentUserCompanyId();
            const where = addCompanyOrProjectToWhere(args.where, companyId, projectId);
            return prisma.comment.findMany({
                ...args,
                where
            });
        }
    }
};
