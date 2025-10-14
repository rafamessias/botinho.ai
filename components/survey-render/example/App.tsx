import React, { useState } from 'react';
import { OpineeoWidget } from '../src';

const App: React.FC = () => {
    const [primaryColor, setPrimaryColor] = useState('#3B82F6');
    const [showWidget, setShowWidget] = useState(false);
    const [apiKey, setApiKey] = useState('demo-api-key');
    const [surveyId, setSurveyId] = useState('demo-survey-id');
    const [logs, setLogs] = useState<string[]>([]);
    const [customCSS, setCustomCSS] = useState(`.sv { --primary: ${primaryColor}; --primary-foreground: #ffffff; }`);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => {
            const newLogs = [...prev, `[${timestamp}] ${message}`];
            // Keep only last 50 logs to prevent memory issues
            return newLogs.slice(-50);
        });
    };

    const handleOpen = (id: string) => {
        addLog(`Widget opened: ${id}`);
    };

    const handleClose = () => {
        addLog('Widget closed');
        setShowWidget(false);
    };

    const handleSubmit = (data: unknown) => {
        addLog(`Feedback submitted: ${JSON.stringify(data)}`);
    };

    const handleResetWidget = () => {
        addLog('Widget reset - remounting...');
        setShowWidget(false);
        setTimeout(() => setShowWidget(true), 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
            {/* Header */}
            <header className="bg-card shadow-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <img
                                src="/opineeo-logo.png"
                                alt="Opineeo Logo"
                                className="w-8 h-8"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Opineeo Widget</h1>
                            <p className="text-sm text-muted-foreground">Interactive Demo & Playground</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Configuration Panel */}
                    <div className="bg-card rounded-xl shadow-md border border-border p-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                            Widget Configuration
                        </h2>
                        <div className="space-y-4">

                            {/* Primary Color */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Primary Color
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => {
                                            setPrimaryColor(e.target.value);
                                            setCustomCSS(`.sv { --primary: ${e.target.value}; --primary-foreground: #ffffff; }`);
                                        }}
                                        className="w-16 h-10 rounded border border-input cursor-pointer bg-background"
                                    />
                                    <input
                                        type="text"
                                        value={primaryColor}
                                        onChange={(e) => {
                                            setPrimaryColor(e.target.value);
                                            setCustomCSS(`.sv { --primary: ${e.target.value}; --primary-foreground: #ffffff; }`);
                                        }}
                                        className="flex-1 px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent font-mono bg-background text-foreground"
                                        placeholder="#3B82F6"
                                    />
                                </div>
                            </div>

                            {/* API Key */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    API Key
                                </label>
                                <input
                                    type="text"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm bg-background text-foreground"
                                    placeholder="your-api-key"
                                />
                            </div>

                            {/* Survey ID */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Survey ID
                                </label>
                                <input
                                    type="text"
                                    value={surveyId}
                                    onChange={(e) => setSurveyId(e.target.value)}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm bg-background text-foreground"
                                    placeholder="survey-id"
                                />
                            </div>

                            {/* Widget Controls */}
                            <div className="space-y-3 pt-4 border-t border-border">
                                <button
                                    onClick={() => setShowWidget(!showWidget)}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${showWidget
                                        ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                        }`}
                                >
                                    {showWidget ? 'Hide Widget' : 'Show Widget'}
                                </button>
                                {showWidget && (
                                    <button
                                        onClick={handleResetWidget}
                                        className="w-full px-4 py-2 border border-input rounded-lg font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors bg-background"
                                    >
                                        Reset Widget (Remount)
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Code Example */}
                        <div className="mt-6 pt-6 border-t border-border">
                            <h3 className="text-sm font-semibold text-foreground mb-3">
                                Usage Example
                            </h3>
                            <pre className="bg-muted text-muted-foreground p-4 rounded-lg overflow-x-auto text-xs">
                                {`import { OpineeoWidget } from 'opineeo-react';

<OpineeoWidget
  token="${apiKey}"
  surveyId="${surveyId}"
  customCSS="${customCSS}"
  onOpen={() => console.log('opened')}
  onClose={() => console.log('closed')}
  onSubmit={(data) => console.log(data)}
/>`}
                            </pre>
                        </div>
                    </div>

                    {/* Event Logs */}
                    <div className="bg-card rounded-xl shadow-md border border-border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">
                                Event Logs
                            </h2>
                            <button
                                onClick={() => setLogs([])}
                                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground border border-input rounded-lg hover:bg-accent transition-colors bg-background"
                            >
                                Clear
                            </button>
                        </div>
                        {/* Widget - Fixed placement */}
                        {showWidget && (
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                                <div className="bg-card rounded-xl shadow-lg border border-border p-2">
                                    <OpineeoWidget
                                        token={apiKey}
                                        surveyId={surveyId}
                                        customCSS={customCSS}
                                        onOpen={handleOpen}
                                        onClose={handleClose}
                                        onSubmit={handleSubmit}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="bg-muted rounded-lg p-4 h-96 overflow-y-auto font-mono text-xs text-chart-1">
                            {logs.length === 0 ? (
                                <div className="text-muted-foreground text-center py-8">
                                    No events yet. Try interacting with the widget!
                                </div>
                            ) : (
                                logs.map((log, index) => (
                                    <div key={index} className="mb-1 break-words">
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="lg:col-span-2 bg-card rounded-xl shadow-md border border-border p-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                            Features
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-accent-foreground"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Easy Integration</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Add to any React app in minutes
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-accent-foreground"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Customizable</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Match your brand colors and style
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-accent-foreground"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Mobile First</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Responsive on all devices
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-accent-foreground"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">TypeScript</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Full type safety included
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-accent-foreground"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Accessible</h3>
                                    <p className="text-sm text-muted-foreground">
                                        ARIA compliant & keyboard nav
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-accent-foreground"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Lightweight</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Minimal bundle size
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default App;

