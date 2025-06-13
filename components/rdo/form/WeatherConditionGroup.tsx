"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Cloud, Moon } from 'lucide-react';

const periods = [
    { key: 'morning', label: 'Manhã', icon: <Sun className="inline w-4 h-4" /> },
    { key: 'afternoon', label: 'Tarde', icon: <Cloud className="inline w-4 h-4" /> },
    { key: 'night', label: 'Noite', icon: <Moon className="inline w-4 h-4 text-red-500" /> },
];

const weatherOptions = [
    { value: 'clear', label: 'Claro' },
    { value: 'cloudy', label: 'Nublado' },
    { value: 'rainy', label: 'Chuvoso' },
];

const practicabilityOptions = [
    { value: 'practicable', label: 'Praticável' },
    { value: 'impracticable', label: 'Impraticável' },
];

export function WeatherConditionGroup({ weather, setWeather }: {
    weather: any, setWeather: (w: any) => void
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">Condição Climática</label>
            <div className="flex flex-col gap-2">
                {periods.map(period => (
                    <div key={period.key} className="flex items-center gap-2">
                        <span className={`text-xs flex items-center gap-1 ${period.key === 'night' ? 'text-red-500' : ''}`}>
                            {period.icon} {period.label}
                        </span>
                        <Select
                            value={weather[period.key].condition}
                            onValueChange={val =>
                                setWeather((w: any) => ({
                                    ...w,
                                    [period.key]: { ...w[period.key], condition: val }
                                }))
                            }
                        >
                            <SelectTrigger className="w-24">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {weatherOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={weather[period.key].practicability}
                            onValueChange={val =>
                                setWeather((w: any) => ({
                                    ...w,
                                    [period.key]: { ...w[period.key], practicability: val }
                                }))
                            }
                        >
                            <SelectTrigger className="w-28">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {practicabilityOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
        </div>
    );
} 