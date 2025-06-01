export interface StrapiResponse<T> {
    data: T;
    meta?: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface StrapiImage {
    id: number;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
        thumbnail: ImageFormat;
        small: ImageFormat;
        medium: ImageFormat;
        large: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    createdAt: string;
    updatedAt: string;
}

interface ImageFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    width: number;
    height: number;
    size: number;
    url: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    firstName: string;
    lastName: string;
    phone: string;
    avatar?: StrapiImage;
    company?: Company;
    type: 'companyUser' | 'projectUser';
    language: 'pt-BR' | 'en';
    createdAt: string;
    updatedAt: string;
}

export interface Company {
    id: number;
    name: string;
    documentType: 'CPF' | 'CNPJ';
    document: string;
    zipCode: string;
    state: string;
    city: string;
    address: string;
    logo?: StrapiImage;
    users?: User[];
    members?: CompanyMember[];
    projects?: Project[];
    createdAt: string;
    updatedAt: string;
}

export interface CompanyMember {
    id: number;
    company: Company;
    user: User;
    role: 'admin' | 'member';
    isAdmin: boolean;
    canPost: boolean;
    canApprove: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    address: string;
    image?: StrapiImage;
    company: Company;
    users?: ProjectUser[];
    rdos?: RDO[];
    incidents?: Incident[];
    createdAt: string;
    updatedAt: string;
}

export interface ProjectUser {
    id: number;
    project: Project;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

export interface RDO {
    id: number;
    user: User;
    project: Project;
    date: string;
    description: string;
    image?: StrapiImage;
    status: 'pending' | 'approved' | 'rejected';
    comments?: Comment[];
    approvals?: Approval[];
    createdAt: string;
    updatedAt: string;
}

export interface Incident {
    id: number;
    user: User;
    project: Project;
    title: string;
    description: string;
    image?: StrapiImage;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    comments?: Comment[];
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: number;
    user: User;
    content: string;
    rdo?: RDO;
    incident?: Incident;
    createdAt: string;
    updatedAt: string;
}

export interface Approval {
    id: number;
    user: User;
    rdo: RDO;
    status: 'approved' | 'rejected';
    comment?: string;
    createdAt: string;
    updatedAt: string;
} 