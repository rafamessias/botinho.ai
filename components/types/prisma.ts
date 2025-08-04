import { RDOStatus, ProjectStatus, WeatherCondition, IncidentStatus, Action, UserType, Language, Provider, DocumentType } from "@/lib/generated/prisma";

export interface FileImage {
    id?: number;
    name: string;
    url: string;
    publicId?: string;
    format?: string;
    version?: string;
    mimeType: string;
    size: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface User {
    id?: number;
    username: string;
    email: string;
    provider?: Provider;
    confirmed?: boolean;
    blocked?: boolean;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: FileImage | FileList | File | null;
    company?: Company | number | null;
    companyMember?: CompanyMember | null;
    projectUser?: ProjectUser[];
    type?: UserType;
    language?: Language;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Company {
    id?: number;
    name: string;
    documentType: DocumentType;
    document: string;
    zipCode: string;
    state: string;
    city: string;
    address: string;
    owner: User | number;
    logo?: FileImage | FileList | File | string | null;
    users?: User[];
    members?: CompanyMember[];
    projects?: Project[];
    activeProjectCount?: number;
    projectCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CompanyMember {
    id?: number;
    company: Company | number;
    user: User | number;
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
    userDocumentId?: string;
    user?: User;
    isAdmin: boolean;
    canPost: boolean;
    canApprove: boolean;
    isOwner?: boolean;
}

export interface Project {
    id?: number;
    active: boolean;
    name: string;
    description: string;
    address: string;
    projectStatus: ProjectStatus;
    rdoCount?: number;
    rdoCountDraft?: number;
    incidentCount?: number;
    incidentCountDraft?: number;
    photoCount?: number;
    image?: FileImage | FileList | File | string | null;
    company: Company | number;
    users?: ProjectUser[];
    rdos?: RDO[];
    incidents?: Incident[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProjectUser {
    id?: number;
    project: Project | number;
    projectUserStatus?: string;
    company?: Company | number;
    user?: User | number;
    name: string;
    email: string;
    phone: string;
    canApprove?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RDO {
    id?: number;
    user?: User | number;
    userName?: string;
    project?: Project | number;
    date: Date;
    description: string;
    equipmentUsed: string;
    workforce: string;
    media?: FileImage[] | FileList | File | string | null;
    rdoStatus: RDOStatus;
    weatherMorningCondition: WeatherCondition;
    weatherMorningWorkable: boolean;
    weatherAfternoonCondition: WeatherCondition;
    weatherAfternoonWorkable: boolean;
    weatherNightCondition: WeatherCondition;
    weatherNightWorkable: boolean;
    commentCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type RDOWithCommentsAndAudit = RDO & {
    comments?: Comment[];
    audit?: Approval[];
};

export interface Incident {
    id?: number;
    user?: User | number;
    userName?: string;
    project: Project | number;
    company?: Company | number;
    description: string;
    media?: FileImage[] | FileList | File | string | null;
    incidentStatus: IncidentStatus;
    priority?: number;
    commentCount?: number;
    date?: Date | string;
    comments?: Comment[];
    approvals?: Approval[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Comment {
    id?: number;
    user: User | number;
    content: string;
    rdo?: RDO | number;
    incident?: Incident | number;
    project?: Project | number;
    userName?: string;
    userEmail?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Approval {
    id?: number;
    company?: Company | number;
    project?: Project | number;
    incident?: Incident | number;
    rdo?: RDO | number;
    user?: User | number;
    userName?: string;
    action?: Action;
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
}