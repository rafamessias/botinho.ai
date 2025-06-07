import React from 'react';
import ContainerApp from '@/components/Container-app';
import RDOCard, { RDO } from '@/components/feedPage/RDOCard';

// Mock data for demonstration
const mockRDOs: RDO[] = [
    {
        id: 24,
        author: 'Giarcalo Cannizza',
        date: '2022-03-28',
        description: 'Montagem de laje para concretagem. Efetuação de ajustes para suporte novo nível de laje.',
        shifts: [
            { label: 'Manhã', icon: '☀️', active: false },
            { label: 'Tarde', icon: '🌤️', active: false },
            { label: 'Noite', icon: '🌙', active: true },
        ],
        images: ['/placeholder-image.webp', '/placeholder-image.webp'],
        comments: 3,
        likes: 3,
        status: 'Esperando Aprovação',
        documentId: '1234567890',
    },
    {
        id: 23,
        author: 'Giarcalo Cannizza',
        date: '2022-03-26',
        description: 'Montagem de laje para concretagem. Efetuação de ajustes para suporte novo nível de laje.',
        shifts: [
            { label: 'Manhã', icon: '☀️', active: false },
            { label: 'Tarde', icon: '🌤️', active: true },
            { label: 'Noite', icon: '🌙', active: false },
        ],
        images: ['/placeholder-image.webp', '/placeholder-avatar.webp'],
        comments: 3,
        likes: 3,
        status: 'Esperando Aprovação',
        documentId: '1234567890',
    },
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

