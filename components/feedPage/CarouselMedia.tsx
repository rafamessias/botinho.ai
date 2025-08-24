'use client'
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, FileText, Video, Image as ImageIcon, Download, Play, Pause } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileImage } from '../types/prisma';
import { Button } from '@/components/ui/button';

interface CarouselMediaProps {
    images: FileImage[];
    className?: string;
}

const CarouselMedia: React.FC<CarouselMediaProps> = ({ images, className }) => {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

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

    const getFileType = (file: FileImage) => {
        const mimeType = file.mimeType?.toLowerCase() || '';
        const name = file.name?.toLowerCase() || '';

        if (mimeType.includes('pdf') || name.endsWith('.pdf')) {
            return 'pdf';
        } else if (mimeType.includes('video') || name.match(/\.(mp4|mov|avi|webm|mkv)$/)) {
            return 'video';
        } else {
            return 'image';
        }
    };

    const getFileIcon = (file: FileImage) => {
        const fileType = getFileType(file);
        switch (fileType) {
            case 'pdf':
                return <FileText className="w-8 h-8 text-red-500" />;
            case 'video':
                return <Video className="w-8 h-8 text-blue-500" />;
            default:
                return <ImageIcon className="w-8 h-8 text-green-500" />;
        }
    };

    const handleDownload = (file: FileImage) => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleVideoPlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const renderFileContent = (file: FileImage, isFullscreenView = false) => {
        const fileType = getFileType(file);

        if (fileType === 'pdf') {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                    <div className="text-center">
                        {getFileIcon(file)}
                        <p className="mt-2 text-sm font-medium text-gray-700">{file.name}</p>
                        {file.size && (
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        )}
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(file);
                            }}
                            className="mt-3 bg-red-500 hover:bg-red-600"
                            size="sm"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                    </div>
                </div>
            );
        } else if (fileType === 'video') {
            if (isFullscreenView) {
                return (
                    <div className="w-full h-full relative bg-black">
                        <video
                            src={file.url}
                            className="w-full h-full object-contain"
                            controls
                            autoPlay
                        />
                        <div className="absolute top-4 right-4">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 bg-white/80 hover:bg-white"
                                onClick={() => handleDownload(file)}
                            >
                                <Download className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="w-full h-full relative bg-gray-100">
                        <video
                            ref={videoRef}
                            src={file.url}
                            className="w-full h-full object-cover"
                            onEnded={handleVideoEnded}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            controls={false}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Button
                                onClick={handleVideoPlayPause}
                                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
                                size="icon"
                            >
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                            </Button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {file.name}
                        </div>
                        <div className="absolute top-2 right-2">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 bg-white/80 hover:bg-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(file);
                                }}
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                );
            }
        } else {
            // Image file
            return (
                <Image
                    src={file.url}
                    alt={file.name || 'Media file'}
                    width={isFullscreenView ? 1920 : 552}
                    height={isFullscreenView ? 1080 : 260}
                    className="object-cover w-full h-full"
                />
            );
        }
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
                                {renderFileContent(image)}
                            </div>
                        ))}
                    </div>

                    {/* Download button overlay for PDF files only (videos have their own download button) */}
                    {getFileType(images[current]) === 'pdf' && (
                        <div className="absolute top-2 right-2">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 bg-white/80 hover:bg-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(images[current]);
                                }}
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {images.length > 1 && (
                        <>
                            <button className='absolute left-0 top-0 h-full flex items-center justify-center w-20'
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
                                className="absolute right-0 top-0 h-full flex items-center justify-center w-20"
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

                {/* File info and carousel dots */}
                <div className="mt-2">


                    {/* Carousel dots */}
                    <div className="flex justify-center">
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
            </div>

            <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                <DialogContent className="!max-w-[680px] !max-h-[680px] px-0 m-0 py-4 border-none">
                    <DialogHeader className='absolute top-0 right-0'>
                        <DialogTitle>
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="relative top-6 w-full h-full rounded-lg">
                        <div className="relative w-full h-full">
                            {renderFileContent(images[current], true)}
                        </div>

                        {/* Download button for fullscreen view */}
                        {getFileType(images[current]) === 'pdf' && (
                            <div className="absolute top-4 right-4">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-10 w-10 bg-white/80 hover:bg-white"
                                    onClick={() => handleDownload(images[current])}
                                >
                                    <Download className="h-5 w-5" />
                                </Button>
                            </div>
                        )}

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-20 flex items-center justify-center"
                                    onClick={handlePrev}
                                    disabled={isAnimating}
                                >
                                    <div className='w-10 h-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors'>
                                        <ChevronLeft className="w-6 h-6" />
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-20 flex items-center justify-center"
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