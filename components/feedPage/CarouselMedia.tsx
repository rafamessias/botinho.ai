'use client'
import React, { useState } from 'react';
import Image from 'next/image';

interface CarouselMediaProps {
    images: string[];
}

const CarouselMedia: React.FC<CarouselMediaProps> = ({ images }) => {
    const [current, setCurrent] = useState(0);
    if (!images || images.length === 0) return null;

    return (
        <div className="w-full mb-2">
            <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                <Image src={images[current]} alt="RDO" width={180} height={160} className="object-cover w-full h-full" />
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1"
                            onClick={() => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                        >
                            {'<'}
                        </button>
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1"
                            onClick={() => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                        >
                            {'>'}
                        </button>
                    </>
                )}
            </div>
            {/* Carousel dots */}
            <div className="flex justify-center mt-1">
                {images.map((_, idx) => (
                    <span
                        key={idx}
                        className={`mx-1 w-2 h-2 rounded-full inline-block ${idx === current ? 'bg-blue-500' : 'bg-gray-300'}`}
                        onClick={() => setCurrent(idx)}
                        style={{ cursor: 'pointer' }}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default CarouselMedia; 