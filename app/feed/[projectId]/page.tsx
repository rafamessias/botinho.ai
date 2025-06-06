import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// Mock data for demonstration
const mockRDOs = [
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
        images: ['/mock-image.jpg', '/mock-image.jpg'],
        comments: 3,
        likes: 3,
        status: 'Esperando Aprovação',
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
        images: ['/mock-image.jpg', '/mock-image.jpg'],
        comments: 3,
        likes: 3,
        status: 'Esperando Aprovação',
    },
];

const FeedPage = ({ params }: { params: { projectId: string } }) => {
    // In a real app, fetch RDOs using projectId
    // const rdos = await fetchRDOs(params.projectId);
    const rdos = mockRDOs;

    return (
        <div className="bg-[#F8F9FB] min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-white shadow-sm">
                <select className="border rounded px-2 py-1 text-sm">
                    <option>Art Museum</option>
                </select>
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white">
                    <Image src="/avatar.jpg" alt="User" width={36} height={36} />
                </div>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto px-2 pb-20">
                {rdos.map((rdo) => (
                    <div key={rdo.id} className="bg-white rounded-xl shadow-sm mb-4 p-4">
                        <div className="flex items-center justify-between mb-1">
                            <div>
                                <span className="text-xs text-gray-500">RDO <b>#{rdo.id}</b></span><br />
                                <span className="text-xs text-gray-500">Postado por <b>{rdo.author}</b></span><br />
                                <span className="text-xs text-gray-400">{new Date(rdo.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <button className="text-gray-400 text-xl">⋮</button>
                        </div>
                        <div className="flex gap-2 mb-2">
                            {rdo.shifts.map((shift, idx) => (
                                <button
                                    key={shift.label}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs border ${shift.active ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                                >
                                    {shift.label} <span>{shift.icon}</span>
                                </button>
                            ))}
                        </div>
                        <div className="text-sm mb-2 text-gray-800">
                            {rdo.description}
                        </div>
                        {/* Image carousel mock */}
                        <div className="w-full h-40 bg-gray-200 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                            <div className="flex w-full h-full">
                                {rdo.images.map((img, idx) => (
                                    <div key={idx} className="flex-1 h-full">
                                        <Image src={img} alt="RDO" width={180} height={160} className="object-cover w-full h-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Carousel dots */}
                        <div className="flex justify-center mb-2">
                            {rdo.images.map((_, idx) => (
                                <span key={idx} className={`mx-1 w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                            ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" /></svg> {rdo.comments}</span>
                                <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg> {rdo.likes}</span>
                            </div>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{rdo.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center py-2 z-10">
                <button className="flex flex-col items-center text-blue-700">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                    <span className="text-xs">Andamento</span>
                </button>
                <button className="flex flex-col items-center relative">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full px-1">1</span>
                    <span className="text-xs">Ocorrências</span>
                </button>
                <button className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full text-2xl -mt-6 shadow-lg">+</button>
                <button className="flex flex-col items-center">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
                    <span className="text-xs">Projeto</span>
                </button>
                <button className="flex flex-col items-center">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                    <span className="text-xs">Lista Projetos</span>
                </button>
            </nav>
            {/* Visily watermark */}
            <div className="fixed bottom-0 left-0 w-full flex justify-center pb-1 pointer-events-none select-none">
                <span className="text-xs text-gray-400">Made with <b>Visily</b></span>
            </div>
        </div>
    );
};

export default FeedPage; 