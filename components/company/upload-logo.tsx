import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function UploadLogo() {
    const t = useTranslations('company');
    return (
        <div className="mb-4">
            <label className="font-semibold">{t('uploadLogo')}</label>
            <p className="text-xs text-gray-500 mb-2">{t('uploadLogoHint')}</p>
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <Image src="/placeholder-avatar.jpg" alt="Logo" width={300} height={160} className="object-cover w-full h-full" />
                <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                >
                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
} 