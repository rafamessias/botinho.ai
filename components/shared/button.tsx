import { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button as UIButton, buttonVariants } from '@/components/ui/button';

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
    const variantMapping = {
        primary: 'default',
        secondary: 'secondary',
        outline: 'outline'
    } as const;

    return (
        <UIButton
            variant={variantMapping[variant]}
            className={cn(
                fullWidth ? 'w-full' : '',
                className,
                'relative'
            )}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {children}
            {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin" />
            )}
        </UIButton>
    );
}