import { RdoCard } from '@/components/rdo/rdo-card';
import { getTranslations } from 'next-intl/server';
import { fetchContentApi } from '@/components/actions/fetch-content-api';
import { RDO } from '@/components/types/strapi';
import ContainerApp from '@/components/Container-app';

export default async function RdoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    console.log(slug);

    let rdo: RDO = {} as RDO;
    try {
        //const rdosFetch: any = await fetchContentApi(`rdos/${slug}?populate=*`, { method: 'GET' });
        //rdo = rdosFetch.data || {};
        //console.log(rdo);

        rdo = {
            id: 1,
            documentId: "rdo-123",
            user: {
                id: 1,
                documentId: "user-123",
                username: "john.doe",
                email: "john.doe@example.com",
                provider: "local",
                confirmed: true,
                blocked: false,
                firstName: "John",
                lastName: "Doe",
                phone: "+1234567890",
                type: "companyUser",
                language: "en",
                createdAt: new Date("2024-03-20T10:00:00Z"),
                updatedAt: new Date("2024-03-20T10:00:00Z")
            },
            project: {
                id: 1,
                documentId: "proj-123",
                name: "Sample Project",
                description: "A sample construction project",
                address: "123 Construction St",
                company: {
                    id: 1,
                    documentId: "comp-123",
                    name: "Sample Company",
                    documentType: "CNPJ",
                    document: "12345678901234",
                    zipCode: "12345-678",
                    state: "CA",
                    city: "Sample City",
                    address: "123 Business Ave",
                    owner: {
                        id: 1,
                        documentId: "user-123",
                        username: "john.doe",
                        email: "john.doe@example.com",
                        provider: "local",
                        confirmed: true,
                        blocked: false,
                        firstName: "John",
                        lastName: "Doe",
                        phone: "+1234567890",
                        type: "companyUser",
                        language: "en",
                        createdAt: new Date("2024-03-20T10:00:00Z"),
                        updatedAt: new Date("2024-03-20T10:00:00Z")
                    },
                    createdAt: new Date("2024-03-20T10:00:00Z"),
                    updatedAt: new Date("2024-03-20T10:00:00Z")
                },
                createdAt: new Date("2024-03-20T10:00:00Z"),
                updatedAt: new Date("2024-03-20T10:00:00Z")
            },
            date: new Date("2024-03-20"),
            description: "Daily work report for construction site activities",
            status: "pending",
            media: [{
                id: 1,
                documentId: "img-123",
                name: "placeholder-image",
                alternativeText: null,
                caption: null,
                width: 800,
                height: 600,
                formats: {
                    thumbnail: {
                        name: "thumbnail_placeholder-image",
                        hash: "thumbnail_placeholder",
                        ext: ".webp",
                        mime: "image/webp",
                        width: 156,
                        height: 117,
                        size: 5.2,
                        url: "/placeholder-image.webp"
                    },
                    small: {
                        name: "small_placeholder-image",
                        hash: "small_placeholder",
                        ext: ".webp",
                        mime: "image/webp",
                        width: 500,
                        height: 375,
                        size: 15.8,
                        url: "/placeholder-image.webp"
                    },
                    medium: {
                        name: "medium_placeholder-image",
                        hash: "medium_placeholder",
                        ext: ".webp",
                        mime: "image/webp",
                        width: 750,
                        height: 563,
                        size: 25.4,
                        url: "/placeholder-image.webp"
                    },
                    large: {
                        name: "large_placeholder-image",
                        hash: "large_placeholder",
                        ext: ".webp",
                        mime: "image/webp",
                        width: 1000,
                        height: 750,
                        size: 35.6,
                        url: "/placeholder-image.webp"
                    }
                },
                hash: "placeholder",
                ext: ".webp",
                mime: "image/webp",
                size: 40.2,
                url: "/placeholder-image.webp",
                previewUrl: null,
                provider: "local",
                createdAt: new Date("2024-03-20T10:00:00Z"),
                updatedAt: new Date("2024-03-20T10:00:00Z")
            }],
            wheatherMorning: { condition: 'clear', workable: true },
            wheatherAfternoon: { condition: 'clear', workable: true },
            wheatherNight: { condition: 'rainy', workable: false },
            comments: [
                {
                    id: 1,
                    documentId: "comm-123",
                    user: {
                        id: 1,
                        documentId: "user-123",
                        username: "john.doe",
                        email: "john.doe@example.com",
                        provider: "local",
                        confirmed: true,
                        blocked: false,
                        firstName: "John",
                        lastName: "Doe",
                        phone: "+1234567890",
                        type: "companyUser",
                        language: "en",
                        createdAt: new Date("2024-03-20T10:00:00Z"),
                        updatedAt: new Date("2024-03-20T10:00:00Z")
                    },
                    content: "Initial progress report",
                    createdAt: new Date("2024-03-20T10:00:00Z"),
                    updatedAt: new Date("2024-03-20T10:00:00Z")
                }
            ],
            approvals: [
                {
                    id: 1,
                    documentId: "appr-123",
                    user: {
                        id: 2,
                        documentId: "user-456",
                        username: "jane.smith",
                        email: "jane.smith@example.com",
                        provider: "local",
                        confirmed: true,
                        blocked: false,
                        firstName: "Jane",
                        lastName: "Smith",
                        phone: "+1987654321",
                        type: "companyUser",
                        language: "en",
                        createdAt: new Date("2024-03-20T10:00:00Z"),
                        updatedAt: new Date("2024-03-20T10:00:00Z")
                    },
                    action: "approved",
                    description: "Work progress looks good",
                    date: new Date("2024-03-20T10:00:00Z"),
                    ip_address: "192.168.1.1",
                    latitude: "37.7749",
                    longitude: "-122.4194",
                    device_type: "mobile",
                    time_zone: "America/Los_Angeles",
                    geo_location: "San Francisco, CA",
                    createdAt: new Date("2024-03-20T10:00:00Z"),
                    updatedAt: new Date("2024-03-20T10:00:00Z")
                }
            ],
            createdAt: new Date("2024-03-20T10:00:00Z"),
            updatedAt: new Date("2024-03-20T10:00:00Z")
        };

    } catch (error) {
        console.error('Failed to fetch projects:', error);
    }

    return (

        <ContainerApp>
            <div className="max-w-[600px] mx-auto w-full">
                <RdoCard rdo={rdo} />
            </div>

        </ContainerApp>

    );
} 