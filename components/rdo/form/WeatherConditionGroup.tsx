"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Cloud, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { WeatherOption } from '@/components/types/strapi';

const periods = [
    { key: 'wheatherMorning', icon: <Sun className="inline w-4 h-4" /> },
    { key: 'wheatherAfternoon', icon: <Cloud className="inline w-4 h-4" /> },
    { key: 'wheatherNight', icon: <Moon className="inline w-4 h-4 " /> },
] as const;

export function WeatherConditionGroup({ weather, setWeather }: {
    weather: WeatherOption, setWeather: (w: WeatherOption) => void
}) {
    const t = useTranslations('form.weather');
    const weatherConditions = ['clear', 'cloudy', 'rainy'];
    const workableOptions = [true, false];

    return (
        <div>
            <label className="block text-sm font-medium mb-2">{t('label')}</label>
            <div className="flex flex-col gap-2">
                {periods.map(period => (
                    <div key={period.key} className="flex flex-col sm:flex-row items-center mb-2 gap-4">
                        <div className={`text-xs flex justify-start items-center gap-1 sm:min-w-[100px]`}>
                            {t(`periods.${period.key.toLowerCase()}`)}
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={weather[period.key]?.condition || ''}
                                onValueChange={val =>
                                    setWeather({
                                        ...weather,
                                        [period.key]: {
                                            ...weather[period.key],
                                            condition: val as 'clear' | 'cloudy' | 'rainy' | null
                                        }
                                    })
                                }
                            >
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {weatherConditions.map(condition => (
                                        <SelectItem key={condition} value={condition}>
                                            {t(`conditions.${condition}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={weather[period.key]?.workable?.toString() || ''}
                                onValueChange={val =>
                                    setWeather({
                                        ...weather,
                                        [period.key]: {
                                            ...weather[period.key],
                                            workable: val === 'true'
                                        }
                                    })
                                }
                            >
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {workableOptions.map(workable => (
                                        <SelectItem key={workable.toString()} value={workable.toString()}>
                                            {t(`workable.${workable}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}