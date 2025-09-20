# Opineeo React Survey Widget

A thin React wrapper for the Opineeo survey widget that makes it easy to integrate surveys into any React application.

## Installation

First, ensure the Opineeo script is available in your `public` folder:
- `public/opineeo-0.0.1.min.js`

## Basic Usage

### With Survey ID and Token (fetches from API)

```tsx
import { OpineeoSurvey } from '@/components/survey-render';

const MyComponent = () => {
  const handleComplete = (responses) => {
    console.log('Survey completed:', responses);
  };

  const handleClose = () => {
    console.log('Survey closed');
  };

  return (
    <div>
      <h2>Please take our survey</h2>
      <OpineeoSurvey
        surveyId="your-survey-id"
        token="your-api-token"
        onComplete={handleComplete}
        onClose={handleClose}
        autoClose={3000} // Auto close after 3 seconds
      />
    </div>
  );
};
```

### With Pre-loaded Survey Data

```tsx
import { OpineeoSurvey, SurveyData } from '@/components/survey-render';

const surveyData: SurveyData = {
  id: "sample-survey",
  questions: [
    {
      id: "q1",
      title: "How satisfied are you with our service?",
      format: "STAR_RATING",
      required: true
    },
    {
      id: "q2", 
      title: "Would you recommend us to others?",
      format: "YES_NO",
      required: true,
      yesLabel: "Absolutely!",
      noLabel: "Not likely"
    },
    {
      id: "q3",
      title: "What could we improve?",
      format: "LONG_TEXT",
      description: "Please share your thoughts..."
    }
  ]
};

const MyComponent = () => {
  return (
    <OpineeoSurvey
      surveyData={surveyData}
      onComplete={(responses) => {
        // Handle responses
        responses.forEach(response => {
          console.log(`${response.questionTitle}: ${response.textValue || response.numberValue || response.booleanValue}`);
        });
      }}
      className="my-4 p-4 border rounded-lg"
    />
  );
};
```

### With Custom Styling

```tsx
import { OpineeoSurvey } from '@/components/survey-render';

const customCSS = `
  .sv {
    border: 2px solid #3b82f6;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .qt {
    color: #1e40af;
    font-size: 20px;
  }
  
  .btnp {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  }
`;

const MyComponent = () => {
  return (
    <OpineeoSurvey
      surveyId="your-survey-id"
      token="your-api-token"
      customCSS={customCSS}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    />
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `surveyId` | `string` | No* | Survey ID for fetching from API |
| `token` | `string` | No* | Authentication token for API requests |
| `surveyData` | `SurveyData` | No* | Pre-loaded survey data (alternative to surveyId/token) |
| `customCSS` | `string` | No | Custom CSS styles to apply to the survey |
| `autoClose` | `number` | No | Auto-close delay in milliseconds (0 = no auto-close) |
| `onComplete` | `(responses: SurveyResponse[]) => void` | No | Callback when survey is completed |
| `onClose` | `() => void` | No | Callback when survey is closed |
| `className` | `string` | No | Custom CSS class name for the container |
| `style` | `React.CSSProperties` | No | Custom styles for the container |

*Either `surveyId`+`token` OR `surveyData` is required.

## Types

### SurveyData
```tsx
interface SurveyData {
  id: string;
  questions: SurveyQuestion[];
  customCSS?: string;
}
```

### SurveyQuestion
```tsx
interface SurveyQuestion {
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
```

### SurveyResponse
```tsx
interface SurveyResponse {
  questionId: string;
  questionTitle: string;
  textValue?: string;
  numberValue?: number;
  booleanValue?: boolean;
  optionId?: string;
  isOther?: boolean;
}
```

## Question Types

- **YES_NO**: Simple yes/no questions with customizable labels
- **SINGLE_CHOICE**: Radio button selection with optional "Other" option
- **MULTIPLE_CHOICE**: Checkbox selection with optional "Other" option  
- **STAR_RATING**: 1-5 star rating system
- **LONG_TEXT**: Multi-line text area for detailed responses
- **STATEMENT**: Display-only text (no user input)

## Mobile First Design

The widget is designed mobile-first and automatically adapts to different screen sizes. It includes:

- Responsive layout that works on phones, tablets, and desktop
- Touch-friendly star rating controls
- Smooth animations and transitions
- Accessible keyboard navigation

## Features

- ✅ **Mobile First**: Optimized for mobile devices with responsive design
- ✅ **TypeScript Support**: Full type definitions included
- ✅ **Auto-loading**: Automatically loads the Opineeo script
- ✅ **Multiple Survey Types**: Support for all question formats
- ✅ **Custom Styling**: Apply custom CSS for branding
- ✅ **Event Callbacks**: Handle completion and close events
- ✅ **API Integration**: Fetch surveys from API or use local data
- ✅ **Auto-close**: Optional automatic closing after completion
- ✅ **Accessibility**: ARIA labels and keyboard navigation
- ✅ **Animation**: Smooth transitions between questions

## Error Handling

The component handles errors gracefully:

- Failed script loading
- Invalid survey data
- API request failures
- Network connectivity issues

All errors are logged to the console and the component will display appropriate error messages to users.

## Performance

- Script is loaded asynchronously to avoid blocking page load
- CSS is scoped to avoid conflicts with your application styles
- Widget instances are properly cleaned up on component unmount
- Minimal bundle size impact on your React application
