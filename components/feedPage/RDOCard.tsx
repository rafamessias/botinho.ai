'use client'
import React from 'react';
import Image from 'next/image';
import CarouselMedia from './CarouselMedia';
import { MessageSquare } from 'lucide-react';
import { Heart } from 'lucide-react';

export interface RDO {
    id: number;
    author: string;
    date: string;
    description: string;
    shifts: { label: string; icon: string; active: boolean }[];
    images: string[];
    comments: number;
    likes: number;
    status: string;
}

interface RDOCardProps {
    rdo: RDO;
}

const RDOCard: React.FC<RDOCardProps> = ({ rdo }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between mb-1">
                <div>
                    <span className="text-xs text-gray-500">RDO <b>#{rdo.id}</b></span><br />
                    <span className="text-xs text-gray-500">Postado por <b>{rdo.author}</b></span><br />
                    <span className="text-xs text-gray-400">{new Date(rdo.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <button className="text-gray-400 text-xl">⋮</button>
            </div>
            <div className="flex gap-2">
                {rdo.shifts.map((shift) => (
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
            <CarouselMedia images={rdo.images} />
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {rdo.comments}</span>
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {rdo.likes}</span>
                </div>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{rdo.status}</span>
            </div>
        </div>
    );
};

export default RDOCard; 