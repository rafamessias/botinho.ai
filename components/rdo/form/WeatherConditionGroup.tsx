"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Cloud, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PrismaWeatherOption } from '@/components/types/prisma';
import { WeatherCondition } from '@/lib/generated/prisma';

const periods = [
    { key: 'weatherMorning', icon: <Sun className="inline w-4 h-4" /> },
    { key: 'weatherAfternoon', icon: <Cloud className="inline w-4 h-4" /> },
    { key: 'weatherNight', icon: <Moon className="inline w-4 h-4 " /> },
] as const;

export function WeatherConditionGroup({ weather, setWeather }: {
    weather: PrismaWeatherOption, setWeather: (w: PrismaWeatherOption) => void
}) {
    const t = useTranslations('formRDO.weather');
    const weatherConditions: WeatherCondition[] = ['clear', 'cloudy', 'rainy'];
    const workableOptions = [true, false];

    const handleWorkableChange = (periodKey: keyof PrismaWeatherOption, value: string) => {
        let workableValue: boolean | null = null;

        if (value === 'none') {
            workableValue = null;
        } else if (value === 'true') {
            workableValue = true;
        } else if (value === 'false') {
            workableValue = false;
        }

        setWeather({
            ...weather,
            [periodKey]: {
                ...weather[periodKey],
                workable: workableValue
            }
        });
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-2">{t('label')}</label>
            <div className="flex flex-col gap-2">
                {periods.map(period => (
                    <div key={period.key} className="flex flex-col sm:flex-row items-center mb-2 gap-4">
                        <div className={`text-xs flex justify-start items-center gap-1 sm:min-w-[100px]`}>
                            {t(`periods.${period.key}`)}
                        </div>
                        <div className="w-full flex flex-1 justify-between sm:justify-start sm:gap-2">
                            <Select
                                value={weather[period.key]?.condition || 'none'}
                                onValueChange={val =>
                                    setWeather({
                                        ...weather,
                                        [period.key]: {
                                            ...weather[period.key],
                                            condition: val === 'none' ? null : val as WeatherCondition
                                        }
                                    })
                                }
                            >
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key="none" value="none" className="min-h-8">
                                        {" "}
                                    </SelectItem>
                                    {weatherConditions.map(condition => (
                                        <SelectItem key={condition} value={condition}>
                                            {t(`conditions.${condition}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={weather[period.key]?.workable?.toString() || 'none'}
                                onValueChange={(val) => handleWorkableChange(period.key, val)}
                            >
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key="none" value="none" className="min-h-8">
                                        {" "}
                                    </SelectItem>
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