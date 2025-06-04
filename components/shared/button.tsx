import { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
    onClick?: () => void;
}

export function Button({
    children,
    isLoading = false,
    variant = 'primary',
    fullWidth = false,
    className,
    disabled,
    onClick = () => { },
    ...props
}: ButtonProps) {
    const baseStyles = 'py-2 rounded-lg font-medium transition-colors';
    const variantStyles = {
        primary: 'bg-primary text-white hover:bg-primary/80 disabled:bg-primary/50',
        secondary: 'bg-secondary text-white hover:bg-secondary/80 disabled:bg-secondary/50',
        outline: 'border text-primary font-medium bg-white hover:bg-gray-100 border-gray-200 disabled:bg-gray-50 disabled:text-gray-400'
    };

    return (
        <button
            className={cn(
                baseStyles,
                variantStyles[variant],
                fullWidth ? 'w-full' : '',
                className,
                'relative'
            )}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {children}
            {isLoading && document.getElementById('obra-form') && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </div>
            )}
        </button>
    );
} 