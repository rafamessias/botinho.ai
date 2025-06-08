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
    documentId: string;
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
    createdAt: Date;
    updatedAt: Date;
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
    documentId: string;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface Company {
    id: number;
    documentId: string;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface CompanyMember {
    id: number;
    documentId: string;
    company: Company;
    user: User;
    role: 'admin' | 'member';
    isAdmin: boolean;
    canPost: boolean;
    canApprove: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
    id: number;
    documentId: string;
    name: string;
    description: string;
    address: string;
    image?: StrapiImage;
    company: Company;
    users?: ProjectUser[];
    rdos?: RDO[];
    incidents?: Incident[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectUser {
    id: number;
    documentId: string;
    project: Project;
    name: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RDO {
    id: number;
    documentId: string;
    user: User;
    project: Project;
    date: Date;
    description: string;
    media?: StrapiImage[];
    status: 'pending' | 'approved' | 'rejected';
    wheatherMorning: { condition: 'clear' | 'cloudy' | 'rainy', workable: boolean };
    wheatherAfternoon: { condition: 'clear' | 'cloudy' | 'rainy', workable: boolean };
    wheatherNight: { condition: 'clear' | 'cloudy' | 'rainy', workable: boolean };
    comments?: Comment[];
    approvals?: Approval[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Incident {
    id: number;
    documentId: string;
    user: User;
    project: Project;
    title: string;
    description: string;
    media?: StrapiImage[];
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    comments?: Comment[];
    approvals?: Approval[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: number;
    documentId: string;
    user: User;
    content: string;
    rdo?: RDO;
    incident?: Incident;
    createdAt: Date;
    updatedAt: Date;
}

export interface Approval {
    id: number;
    documentId: string;
    company?: Company;
    project?: Project;
    incident?: Incident;
    rdo?: RDO;
    user: User;
    action: 'approved' | 'rejected';
    description?: string;
    date: Date;
    ip_address?: string;
    latitude?: string;
    longitude?: string;
    device_type?: string;
    time_zone?: string;
    geo_location?: string;
    createdAt: Date;
    updatedAt: Date;

} 