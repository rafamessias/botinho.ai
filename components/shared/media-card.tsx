'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileImage as FileImageIcon, Download } from 'lucide-react';
import Image from 'next/image';
import { FileImage } from '@/components/types/prisma';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface MediaCardProps {
    media: FileImage;
    t: (key: string) => string;
}

export default function MediaCard({ media, t }: MediaCardProps) {
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = media.url;
        link.download = media.name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-square">
                <Image
                    src={media.url}
                    alt={media.name || 'Project media'}
                    fill
                    className="object-cover"
                />
                <div className="absolute top-2 right-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={handleDownload}
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <CardContent className="p-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FileImageIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium truncate">
                            {media.name || 'Untitled'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                            {media.createdAt ?
                                format(new Date(media.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) :
                                'Data não disponível'
                            }
                        </span>
                    </div>

                    {media.size && (
                        <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                                {formatFileSize(media.size)}
                            </Badge>
                            {media.mimeType && (
                                <Badge variant="outline" className="text-xs">
                                    {media.mimeType?.toUpperCase()}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 