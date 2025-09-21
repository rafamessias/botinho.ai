"use client";

import { useEffect, useRef, useId } from 'react';

// Type definitions for the survey widget
export interface SurveyQuestion {
    id: string;
    title: string;
    description?: string;
    format: 'YES_NO' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'STAR_RATING' | 'LONG_TEXT' | 'STATEMENT';
    required?: boolean;
    yesLabel?: string;
    noLabel?: string;
    options?: Array<{
        id: string;
        text: string;
        isOther?: boolean;
    }>;
}

export interface SurveyData {
    id: string;
    questions: SurveyQuestion[];
    customCSS?: string;
}

export interface SurveyResponse {
    questionId: string;
    questionTitle: string;
    textValue?: string;
    numberValue?: number;
    booleanValue?: boolean;
    optionId?: string;
    isOther?: boolean;
}

export interface OpineeoSurveyProps {
    /** Survey ID for fetching from API */
    surveyId?: string;
    /** Authentication token for API requests */
    token?: string;
    /** Pre-loaded survey data (alternative to surveyId/token) */
    surveyData?: SurveyData;
    /** Custom CSS styles to apply to the survey */
    customCSS?: string;
    /** Auto-close delay in milliseconds (0 = no auto-close) */
    autoClose?: number;
    /** User ID to associate with survey responses */
    userId?: string;
    /** Whether to include extra info in survey responses */
    extraInfo?: string;
    /** Callback when survey is completed */
    onComplete?: (responses: SurveyResponse[]) => void;
    /** Callback when survey is closed */
    onClose?: () => void;
    /** Custom CSS class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
}

// Global widget class interface
declare global {
    interface Window {
        initSurveyWidget?: (options: any) => any;
    }
}

const loadOpineeoScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Check if script is already loaded
        if (window.initSurveyWidget) {
            resolve();
            return;
        }

        // Check if script is already in DOM
        const existingScript = document.querySelector('script[src*="opineeo"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', reject);
            return;
        }

        // Create and load script
        const script = document.createElement('script');
        script.src = '/opineeo-0.0.1.min.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

export const OpineeoSurvey: React.FC<OpineeoSurveyProps> = ({
    surveyId,
    token,
    surveyData,
    customCSS,
    autoClose = 0,
    userId,
    extraInfo = '',
    onComplete,
    onClose,
    className,
    style,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<any>(null);
    const containerId = useId().replace(/:/g, '');

    // Effect for initializing widget - only recreate when essential props change
    useEffect(() => {
        const initializeWidget = async () => {
            try {
                // Load the Opineeo script if not already loaded
                await loadOpineeoScript();

                if (!window.initSurveyWidget) {
                    console.error('Opineeo widget not available');
                    return;
                }

                // Clean up previous widget
                if (widgetRef.current) {
                    widgetRef.current.destroy?.();
                }

                // Initialize new widget
                const widget = window.initSurveyWidget({
                    surveyId,
                    token,
                    surveyData,
                    customCSS,
                    autoClose,
                    userId,
                    extraInfo,
                    onComplete: (responses: SurveyResponse[]) => {
                        onComplete?.(responses);
                    },
                    onClose: () => {
                        onClose?.();
                    },
                });

                widgetRef.current = widget;

                // Mount the widget
                if (containerRef.current) {
                    await widget.mount(containerId);
                }
            } catch (error) {
                console.error('Failed to initialize Opineeo survey:', error);
            }
        };

        initializeWidget();

        // Cleanup on unmount
        return () => {
            if (widgetRef.current) {
                widgetRef.current.destroy?.();
                widgetRef.current = null;
            }
        };
    }, [surveyId, token, surveyData, containerId]); // Removed customCSS, autoClose, callbacks

    // Separate effect for updating CSS without recreating widget
    useEffect(() => {
        if (widgetRef.current && customCSS !== undefined) {
            // Update CSS without recreating widget
            widgetRef.current.customCSS = customCSS;
            widgetRef.current.addCustomStyles?.();
        }
    }, [customCSS]);

    // Separate effect for updating autoClose without recreating widget
    useEffect(() => {
        if (widgetRef.current && autoClose !== undefined) {
            widgetRef.current.autoClose = autoClose;
        }
    }, [autoClose]);

    // Separate effect for updating callbacks without recreating widget
    useEffect(() => {
        if (widgetRef.current) {
            widgetRef.current.onComplete = (responses: SurveyResponse[]) => {
                onComplete?.(responses);
            };
            widgetRef.current.onClose = () => {
                onClose?.();
            };
        }
    }, [onComplete, onClose]);

    return (
        <div id={containerId} ref={containerRef}
            className={className}
            style={style} />
    );
};

export default OpineeoSurvey;
