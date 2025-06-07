'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselMediaProps {
    images: string[];
}

const CarouselMedia: React.FC<CarouselMediaProps> = ({ images }) => {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    if (!images || images.length === 0) return null;

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setTimeout(() => setIsAnimating(false), 500);
    };

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <div className="w-full mb-2">
            <div className="w-full h-[260px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full relative">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${index === current ? 'translate-x-0' :
                                index < current ? '-translate-x-full' : 'translate-x-full'
                                }`}
                        >
                            <Image
                                src={image}
                                alt="RDO"
                                width={552}
                                height={260}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ))}
                </div>
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-10"
                            onClick={handlePrev}
                            disabled={isAnimating}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-10"
                            onClick={handleNext}
                            disabled={isAnimating}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
            {/* Carousel dots */}
            <div className="flex justify-center mt-1">
                {images.map((_, idx) => (
                    <span
                        key={idx}
                        className={`mx-1 w-2 h-2 rounded-full inline-block transition-colors duration-300 ${idx === current ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                        onClick={() => {
                            if (isAnimating) return;
                            setIsAnimating(true);
                            setCurrent(idx);
                            setTimeout(() => setIsAnimating(false), 500);
                        }}
                        style={{ cursor: isAnimating ? 'default' : 'pointer' }}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default CarouselMedia; 