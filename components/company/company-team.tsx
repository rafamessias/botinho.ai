import { useTranslations } from 'next-intl';

export default function CompanyTeam() {
    const t = useTranslations('company');
    return (
        <div>
            <label className="font-semibold">{t('companyTeam')}</label>
            <p className="text-xs text-gray-500 mb-2">{t('companyTeamHint')}</p>
            <div className="space-y-2">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-yellow-200" />
                    <div>
                        <div className="font-semibold text-sm">João da Silva</div>
                        <div className="text-xs text-gray-500">joaodasilva@terra.com</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-pink-50 rounded-lg p-2 border-2 border-blue-700">
                    <span className="inline-block w-8 h-8 rounded-full bg-pink-200" />
                    <div>
                        <div className="font-semibold text-sm">Maria Aparecida da Silva</div>
                        <div className="text-xs text-gray-500">mariaap@uol.com</div>
                    </div>
                </div>
            </div>
            <button
                type="button"
                className="w-full mt-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold"
            >
                {t('addTeam')}
            </button>
        </div>
    );
} 