# Survey Widget Component

A reusable survey widget component that renders surveys based on survey ID or JSON data, with support for all question types and customizable styling.

## Features

- **Question Navigation**: Handles one question at a time with Previous/Continue buttons
- **All Question Types**: Supports YES_NO, SINGLE_CHOICE, MULTIPLE_CHOICE, STAR_RATING, LONG_TEXT, and STATEMENT formats
- **Test Mode**: Run surveys without saving data for testing purposes
- **Custom Styling**: Applies survey-specific styling (colors, fonts, spacing)
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Error Handling**: Graceful error handling with user feedback

## Usage

### Method 1: Using Survey ID

```tsx
import { SurveyWidget } from '@/components/survey-render'

function MyComponent() {
  const handleComplete = (responses) => {
    console.log('Survey completed:', responses)
  }

  const handleError = (error) => {
    console.error('Survey error:', error)
  }

  return (
    <SurveyWidget
      surveyId="your-survey-id"
      key="unique-key"
      onComplete={handleComplete}
      onError={handleError}
    />
  )
}
```

### Method 2: Using JSON Data

```tsx
import { SurveyWidget, createSurveyWidgetFromJSON } from '@/components/survey-render'

function MyComponent() {
  const surveyJSON = {
    id: "my-survey",
    name: "Customer Feedback",
    description: "Help us improve our service",
    status: "published",
    questions: [
      {
        id: "q1",
        title: "How satisfied are you?",
        format: "STAR_RATING",
        required: true,
        order: 0,
        options: []
      }
    ],
    style: {
      backgroundColor: "#f8fafc",
      textColor: "#1e293b",
      buttonBackgroundColor: "#3b82f6",
      buttonTextColor: "#ffffff",
      margin: "20px 0px",
      padding: "24px",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      titleFontSize: "20px",
      bodyFontSize: "16px",
      fontFamily: "Inter"
    }
  }

  const handleComplete = (responses) => {
    console.log('Survey completed:', responses)
  }

  const handleError = (error) => {
    console.error('Survey error:', error)
  }

  // Option A: Direct JSON data
  return (
    <SurveyWidget
      surveyData={surveyJSON}
      key="json-survey"
      onComplete={handleComplete}
      onError={handleError}
    />
  )

  // Option B: Using helper function
  return createSurveyWidgetFromJSON(surveyJSON, {
    testMode: true,
    onComplete: handleComplete,
    onError: handleError
  })
}
```

### Test Mode

```tsx
<SurveyWidget
  surveyId="your-survey-id"
  key="test-key"
  testMode={true}
  onComplete={handleComplete}
  onError={handleError}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `surveyId` | `string` | No* | The ID of the survey to render (required if surveyData not provided) |
| `surveyData` | `Survey` | No* | Direct survey data object (required if surveyId not provided) |
| `key` | `string` | Yes | A unique key for the widget instance |
| `testMode` | `boolean` | No | If true, survey runs without saving data (default: false) |
| `onComplete` | `(responses: SurveyResponse[]) => void` | No | Callback when survey is completed |
| `onError` | `(error: string) => void` | No | Callback when an error occurs |

*Either `surveyId` or `surveyData` must be provided.

## Response Format

The `onComplete` callback receives an array of `SurveyResponse` objects:

```typescript
interface SurveyResponse {
  questionId: string
  optionId?: string
  textValue?: string
  numberValue?: number
  booleanValue?: boolean
  isOther?: boolean
}
```

## JSON Data Structure

When using JSON data, the structure should match the following format:

```typescript
interface SurveyJSON {
  id: string
  name: string
  description?: string
  status: "draft" | "published" | "archived"
  questions: Array<{
    id: string
    title: string
    description?: string
    format: "YES_NO" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "STAR_RATING" | "LONG_TEXT" | "STATEMENT"
    required: boolean
    order: number
    yesLabel?: string
    noLabel?: string
    buttonLabel?: string
    options: Array<{
      id: string
      text: string
      order: number
      isOther?: boolean
    }>
  }>
  style: {
    backgroundColor: string
    textColor: string
    buttonBackgroundColor: string
    buttonTextColor: string
    margin: string
    padding: string
    border: string
    borderRadius: string
    titleFontSize: string
    bodyFontSize: string
    fontFamily: string
  }
}
```

## Question Types Supported

1. **YES_NO**: Radio buttons with custom Yes/No labels
2. **SINGLE_CHOICE**: Radio buttons with multiple options
3. **MULTIPLE_CHOICE**: Checkboxes allowing multiple selections
4. **STAR_RATING**: Interactive star rating (1-5 stars)
5. **LONG_TEXT**: Textarea for long text responses
6. **STATEMENT**: Display-only statements with continue button

## Styling

The widget automatically applies the survey's custom styling including:
- Background color
- Text color
- Button colors
- Font family and sizes
- Border radius and padding
- Margins and borders

## Demo

Use the demo components to test the widget:

```tsx
// For survey ID-based widgets
import { SurveyWidgetDemo } from '@/components/survey-render/survey-widget-demo'

// For JSON-based widgets
import { SurveyWidgetJSONDemo } from '@/components/survey-render/survey-widget-json-demo'

function DemoPage() {
  return (
    <div>
      <SurveyWidgetDemo />
      <SurveyWidgetJSONDemo />
    </div>
  )
}
```

## Error Handling

The widget handles various error scenarios:
- Survey not found
- Survey not published (unless in test mode)
- Network errors
- Invalid survey data

All errors are passed to the `onError` callback for custom handling.
