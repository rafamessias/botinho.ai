'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { StrapiImage } from '../types/strapi';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CarouselMediaProps {
    images: StrapiImage[];
    className?: string;
}

const CarouselMedia: React.FC<CarouselMediaProps> = ({ images, className }) => {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

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

    const openFullscreen = () => {
        setIsFullscreen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
    };

    return (
        <>
            <div className="w-full mb-2">
                <div
                    className={`w-full h-[260px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative border border-gray-200 cursor-pointer ${className}`}
                    onClick={openFullscreen}
                >
                    <div className="w-full h-full relative">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${index === current ? 'translate-x-0' :
                                    index < current ? '-translate-x-full' : 'translate-x-full'
                                    }`}
                            >
                                <Image
                                    src={image.url}
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
                            <button className='absolute left-0 top-0 h-full flex items-center justify-center w-10'
                                type='button'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrev();
                                }}
                                disabled={isAnimating}
                            >
                                <div
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-10"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </div>
                            </button>
                            <button
                                type="button"
                                className="absolute right-0 top-0 h-full flex items-center justify-center w-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                                disabled={isAnimating}
                            >
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-10">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
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
                            onClick={(e) => {
                                e.stopPropagation();
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

            <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                <DialogContent className="!max-w-[680px] !max-h-[680px] px-0 m-0 py-4 border-none">
                    <DialogHeader className='absolute top-0 right-0'>
                        <DialogTitle>
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="relative top-6 w-full h-full rounded-lg">

                        <div className="relative w-full h-full ">
                            <Image
                                src={images[current].url}
                                alt="RDO"
                                width={1920}
                                height={1080}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-12 flex items-center justify-center"
                                    onClick={handlePrev}
                                    disabled={isAnimating}
                                >
                                    <div className='w-10 h-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors'>
                                        <ChevronLeft className="w-6 h-6" />
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-12 flex items-center justify-center"
                                    onClick={handleNext}
                                    disabled={isAnimating}
                                >
                                    <div className='w-10 h-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors'>
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </button>
                            </>
                        )}
                    </div>
                    <DialogFooter className='flex !justify-center'>
                        {/* Carousel dots */}
                        <div className="flex justify-center mt-6">
                            {images.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`mx-1 w-2 h-2 rounded-full inline-block transition-colors duration-300 ${idx === current ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isAnimating) return;
                                        setIsAnimating(true);
                                        setCurrent(idx);
                                        setTimeout(() => setIsAnimating(false), 500);
                                    }}
                                    style={{ cursor: isAnimating ? 'default' : 'pointer' }}
                                ></span>
                            ))}
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CarouselMedia; 