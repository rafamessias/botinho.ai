# Survey Widget Component

A reusable survey widget component that renders surveys based on survey ID and key, with support for all question types and customizable styling.

## Features

- **Question Navigation**: Handles one question at a time with Previous/Continue buttons
- **All Question Types**: Supports YES_NO, SINGLE_CHOICE, MULTIPLE_CHOICE, STAR_RATING, LONG_TEXT, and STATEMENT formats
- **Test Mode**: Run surveys without saving data for testing purposes
- **Custom Styling**: Applies survey-specific styling (colors, fonts, spacing)
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Error Handling**: Graceful error handling with user feedback

## Usage

### Basic Usage

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
| `surveyId` | `string` | Yes | The ID of the survey to render |
| `key` | `string` | Yes | A unique key for the widget instance |
| `testMode` | `boolean` | No | If true, survey runs without saving data (default: false) |
| `onComplete` | `(responses: SurveyResponse[]) => void` | No | Callback when survey is completed |
| `onError` | `(error: string) => void` | No | Callback when an error occurs |

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

Use the `SurveyWidgetDemo` component to test the widget:

```tsx
import { SurveyWidgetDemo } from '@/components/survey-render/survey-widget-demo'

function DemoPage() {
  return <SurveyWidgetDemo />
}
```

## Error Handling

The widget handles various error scenarios:
- Survey not found
- Survey not published (unless in test mode)
- Network errors
- Invalid survey data

All errors are passed to the `onError` callback for custom handling.
