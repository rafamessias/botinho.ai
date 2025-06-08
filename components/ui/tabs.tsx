import * as React from 'react';

const TABS_COMPONENT = Symbol('TABS_COMPONENT');

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children: React.ReactNode;
}

export function Tabs({ value, onValueChange, className, children }: TabsProps) {
    return (
        <div className={className} data-tabs-value={value}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    const type = child.type as any;
                    if (type && type[TABS_COMPONENT]) {
                        return React.cloneElement(child as any, { tabsValue: value, onValueChange } as any);
                    }
                }
                return child;
            })}
        </div>
    );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
    tabsValue?: string;
    onValueChange?: (value: string) => void;
}

export function TabsList({ className, children, tabsValue, onValueChange, ...props }: TabsListProps) {
    return (
        <div className={className} {...props} role="tablist">
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    const type = child.type as any;
                    if (type && type[TABS_COMPONENT]) {
                        return React.cloneElement(child as any, { tabsValue, onValueChange } as any);
                    }
                }
                return child;
            })}
        </div>
    );
}
TabsList[TABS_COMPONENT] = true;

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    tabsValue?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children: React.ReactNode;
}

export function TabsTrigger({ value, tabsValue, onValueChange, className, children, ...props }: TabsTriggerProps) {
    const isActive = value === tabsValue;
    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            className={
                `${className ?? ''} px-3 py-1 rounded-lg transition-colors ${isActive ? 'bg-white shadow text-primary font-semibold' : 'bg-transparent text-gray-500'}`
            }
            tabIndex={isActive ? 0 : -1}
            onClick={() => onValueChange && onValueChange(value)}
            {...props}
        >
            {children}
        </button>
    );
}
TabsTrigger[TABS_COMPONENT] = true;

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    tabsValue?: string;
    children: React.ReactNode;
}

export function TabsContent({ value, tabsValue, children, ...props }: TabsContentProps) {
    if (value !== tabsValue) return null;
    return (
        <div role="tabpanel" {...props}>
            {children}
        </div>
    );
}
TabsContent[TABS_COMPONENT] = true; 