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
    id?: number;
    documentId?: string;
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
    createdAt?: Date;
    updatedAt?: Date;
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
    id?: number;
    documentId?: string;
    username: string;
    email: string;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: StrapiImage | FileList | null;
    company?: Company | number;
    companyMember?: CompanyMember | null;
    type?: 'companyUser' | 'projectUser';
    language?: 'pt-BR' | 'en';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Company {
    id?: number;
    documentId?: string;
    name: string;
    documentType: 'CPF' | 'CNPJ';
    document: string;
    zipCode: string;
    state: string;
    city: string;
    address: string;
    owner: User | number;
    logo?: StrapiImage | FileList | null;
    users?: User[];
    members?: CompanyMember[];
    projects?: Project[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CompanyMember {
    id?: number;
    documentId?: string;
    company: Company | number;
    user: User | number;
    role: 'admin' | 'member';
    isAdmin: boolean;
    canPost: boolean;
    canApprove: boolean;
    isOwner: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CompanyMemberDialog {
    id?: number;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    avatar?: string;
    documentId?: string;
    user?: User;
    isAdmin: boolean;
    canPost: boolean;
    canApprove: boolean;
    isOwner?: boolean;
}

export interface Project {
    id?: number;
    documentId?: string;
    name: string;
    description: string;
    address: string;
    image?: StrapiImage | FileList | null;
    company: Company | number;
    users?: ProjectUser[];
    rdos?: RDO[];
    incidents?: Incident[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProjectUser {
    id?: number;
    documentId?: string;
    project: Project | number;
    name: string;
    email: string;
    phone: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RDO {
    id?: number;
    documentId?: string;
    user?: User | number;
    project?: Project | number;
    date: Date;
    description: string;
    equipmentUsed: string;
    workforce: string;
    media?: StrapiImage[] | FileList | null;
    rdoStatus: RDOStatus;
    weatherMorning: RDOWeather | RDOWeather[] | null;
    weatherAfternoon: RDOWeather | RDOWeather[] | null;
    weatherNight: RDOWeather | RDOWeather[] | null;
    commentCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type RDOStatus = 'draft' | 'pendingApproval' | 'Approved' | 'Rejected';

export interface RDOWeather {
    condition: 'clear' | 'cloudy' | 'rainy' | null;
    workable: boolean | null;
}

//used for the weather condition group
export type WeatherOption = {
    weatherMorning: RDOWeather | RDOWeather[] | null;
    weatherAfternoon: RDOWeather | RDOWeather[] | null;
    weatherNight: RDOWeather | RDOWeather[] | null;
};


export type RDOWithCommentsAndAudit = RDO & {
    comments?: Comment[];
    audit?: Approval[];
};

export interface Incident {
    id?: number;
    documentId?: string;
    user: User | number;
    project: Project | number;
    title: string;
    description: string;
    media?: StrapiImage[] | FileList | null;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    comments?: Comment[];
    approvals?: Approval[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Comment {
    id?: number;
    documentId?: string;
    user: User | number;
    content: string;
    rdo?: RDO | number;
    incident?: Incident | number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Approval {
    id?: number;
    documentId?: string;
    company?: Company | number;
    project?: Project | number;
    incident?: Incident | number;
    rdo?: RDO | number;
    user?: User | number;
    action?: 'Approved' | 'Rejected';
    description?: string;
    date?: Date;
    ip_address?: string;
    latitude?: string;
    longitude?: string;
    device_type?: string;
    time_zone?: string;
    geo_location?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    error?: string | null;
    data?: T | null;
    meta?: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    } | null;
}