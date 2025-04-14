'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="text-center space-y-6 px-4">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold text-foreground">Página não encontrada</h2>
                <p className="text-muted-foreground max-w-md">
                    Oops! A página que você está procurando não existe ou foi movida.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Voltar
                    </Button>
                    <Button
                        onClick={() => router.push('/')}
                    >
                        Ir para a página inicial
                    </Button>
                </div>
            </div>
        </div>
    );
} 