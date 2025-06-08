import React from 'react';
import ContainerApp from '@/components/Container-app';
import RDOCard from '@/components/feedPage/RDOCard';
import { RDO } from '@/types/strapi';

// Mock data for demonstration
const mockRDOs: RDO[] = [
    {
        id: 24,
        documentId: '1234567890',
        user: {
            id: 1,
            documentId: 'user123',
            username: 'giarcalo',
            email: 'giarcalo@example.com',
            provider: 'local',
            confirmed: true,
            blocked: false,
            firstName: 'Giarcalo',
            lastName: 'Cannizza',
            phone: '+5511999999999',
            type: 'companyUser',
            language: 'pt-BR',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        project: {
            id: 1,
            documentId: 'proj123',
            name: 'Projeto Exemplo',
            description: 'Descrição do projeto',
            address: 'Rua Exemplo, 123',
            company: {
                id: 1,
                documentId: 'comp123',
                name: 'Empresa Exemplo',
                documentType: 'CNPJ',
                document: '12345678901234',
                zipCode: '12345678',
                state: 'SP',
                city: 'São Paulo',
                address: 'Rua Empresa, 456',
                createdAt: new Date('2022-01-01'),
                updatedAt: new Date('2022-01-01')
            },
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        date: new Date('2022-03-28'),
        description: 'Montagem de laje para concretagem. Efetuação de ajustes para suporte novo nível de laje.',
        media: [
            {
                id: 1,
                documentId: 'img123',
                name: 'placeholder-image.webp',
                alternativeText: null,
                caption: null,
                width: 800,
                height: 600,
                formats: {
                    thumbnail: {
                        name: 'thumbnail_placeholder-image.webp',
                        hash: 'thumbnail_123',
                        ext: '.webp',
                        mime: 'image/webp',
                        width: 156,
                        height: 117,
                        size: 5.2,
                        url: '/placeholder-image.webp'
                    },
                    small: {
                        name: 'small_placeholder-image.webp',
                        hash: 'small_123',
                        ext: '.webp',
                        mime: 'image/webp',
                        width: 500,
                        height: 375,
                        size: 15.1,
                        url: '/placeholder-image.webp'
                    },
                    medium: {
                        name: 'medium_placeholder-image.webp',
                        hash: 'medium_123',
                        ext: '.webp',
                        mime: 'image/webp',
                        width: 750,
                        height: 563,
                        size: 25.1,
                        url: '/placeholder-image.webp'
                    },
                    large: {
                        name: 'large_placeholder-image.webp',
                        hash: 'large_123',
                        ext: '.webp',
                        mime: 'image/webp',
                        width: 1000,
                        height: 750,
                        size: 35.1,
                        url: '/placeholder-image.webp'
                    }
                },
                hash: 'image123',
                ext: '.webp',
                mime: 'image/webp',
                size: 25.1,
                url: '/placeholder-image.webp',
                previewUrl: null,
                provider: 'local',
                createdAt: new Date('2022-01-01'),
                updatedAt: new Date('2022-01-01')
            }
        ],
        status: 'pending',
        wheatherMorning: { condition: 'clear', workable: true },
        wheatherAfternoon: { condition: 'cloudy', workable: true },
        wheatherNight: { condition: 'rainy', workable: false },
        comments: [
            {
                id: 1,
                documentId: 'comment123',
                user: {
                    id: 2,
                    documentId: 'user456',
                    username: 'joao',
                    email: 'joao@example.com',
                    provider: 'local',
                    confirmed: true,
                    blocked: false,
                    firstName: 'João',
                    lastName: 'Silva',
                    phone: '+5511988888888',
                    type: 'companyUser',
                    language: 'pt-BR',
                    createdAt: new Date('2022-01-01'),
                    updatedAt: new Date('2022-01-01')
                },
                content: 'Comentário de exemplo',
                createdAt: new Date('2022-03-28'),
                updatedAt: new Date('2022-03-28')
            }
        ],
        approvals: [],
        createdAt: new Date('2022-03-28'),
        updatedAt: new Date('2022-03-28')
    },
    {
        id: 23,
        documentId: '1234567891',
        user: {
            id: 1,
            documentId: 'user123',
            username: 'giarcalo',
            email: 'giarcalo@example.com',
            provider: 'local',
            confirmed: true,
            blocked: false,
            firstName: 'Giarcalo',
            lastName: 'Cannizza',
            phone: '+5511999999999',
            type: 'companyUser',
            language: 'pt-BR',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        project: {
            id: 1,
            documentId: 'proj123',
            name: 'Projeto Exemplo',
            description: 'Descrição do projeto',
            address: 'Rua Exemplo, 123',
            company: {
                id: 1,
                documentId: 'comp123',
                name: 'Empresa Exemplo',
                documentType: 'CNPJ',
                document: '12345678901234',
                zipCode: '12345678',
                state: 'SP',
                city: 'São Paulo',
                address: 'Rua Empresa, 456',
                createdAt: new Date('2022-01-01'),
                updatedAt: new Date('2022-01-01')
            },
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        date: new Date('2022-03-26'),
        description: 'Montagem de laje para concretagem. Efetuação de ajustes para suporte novo nível de laje.',
        media: [
            {
                id: 2,
                documentId: 'img124',
                name: 'placeholder-avatar.webp',
                alternativeText: null,
                caption: null,
                width: 800,
                height: 600,
                formats: {
                    thumbnail: {
                        name: 'thumbnail_placeholder-avatar.webp',
                        hash: 'thumbnail_124',
                        ext: '.webp',
                        mime: 'image/webp',
                        width: 156,
                        height: 117,
                        size: 5.2,
                        url: '/placeholder-avatar.webp'
                    },
                    small: {
                        name: 'small_placeholder-avatar.webp',
                        hash: 'small_124',
                        ext: '.webp',
                        mime: 'image/webp',
                        width: 500,
                        height: 375,
                        size: 15.1,
                        url: '/placeholder-avatar.webp'
                    },
                    medium: {
                        name: 'medium_placeholder-avatar.webp',
                        hash: 'medium_124',
                        ext: '.webp',
                        mime: 'image/webp',
                        width: 750,
                        height: 563,
                        size: 25.1,
                        url: '/placeholder-avatar.webp'
                    },
                    large: {
                        name: 'large_placeholder-avatar.webp',
                        hash: 'large_124',
                        ext: '.webp',
                        mime: 'image/webp',
                        width: 1000,
                        height: 750,
                        size: 35.1,
                        url: '/placeholder-avatar.webp'
                    }
                },
                hash: 'image124',
                ext: '.webp',
                mime: 'image/webp',
                size: 25.1,
                url: '/placeholder-avatar.webp',
                previewUrl: null,
                provider: 'local',
                createdAt: new Date('2022-01-01'),
                updatedAt: new Date('2022-01-01')
            }
        ],
        status: 'pending',
        wheatherMorning: { condition: 'clear', workable: true },
        wheatherAfternoon: { condition: 'cloudy', workable: true },
        wheatherNight: null,
        comments: [],
        approvals: [],
        createdAt: new Date('2022-03-26'),
        updatedAt: new Date('2022-03-26')
    }
];

export default async function FeedPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
    const { locale, slug } = await params;
    // In a real app, fetch RDOs using projectId
    // const rdos = await fetchRDOs(params.projectId);
    const rdos = mockRDOs;

    return (
        <ContainerApp>
            <div className="max-w-[600px] mx-auto w-full">
                {/* Feed */}
                <div className="flex-1 overflow-y-auto pb-20 space-y-10">
                    {rdos.map((rdo) => (
                        <RDOCard key={rdo.id} rdo={rdo} />
                    ))}
                </div>
            </div>
        </ContainerApp>
    );
};

