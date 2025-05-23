import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export async function BottomNav() {
    const t = useTranslations('rdo.bottomNav');

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t flex justify-around items-center h-16">
            <Button variant="ghost" className="flex flex-col items-center gap-1 text-xs">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><rect width="18" height="14" x="3" y="5" rx="2" /><path d="M9 3v2" /><path d="M15 3v2" /></svg>
                {t('progress')}
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1 text-xs relative">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                {t('occurrences')}
                <span className="absolute top-1 right-2 bg-red-500 text-white rounded-full text-[10px] px-1">1</span>
            </Button>
            <Button className="rounded-full bg-primary text-white w-12 h-12 flex items-center justify-center text-2xl shadow-lg -mt-8 border-4 border-white">+</Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1 text-xs">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder"><path d="M22 19V7a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" /></svg>
                {t('project')}
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1 text-xs">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><rect width="18" height="14" x="3" y="5" rx="2" /><path d="M9 3v2" /><path d="M15 3v2" /></svg>
                {t('projectList')}
            </Button>
        </nav>
    );
} 