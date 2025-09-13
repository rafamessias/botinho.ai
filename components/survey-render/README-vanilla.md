# Vanilla JavaScript Survey Widget

A standalone survey widget that can be embedded in third-party websites and applications. This is a vanilla JavaScript implementation of the React survey widget, designed to work without any external dependencies.

## Features

- **Multiple Question Types**: Support for Yes/No, Single Choice, Multiple Choice, Star Rating, Long Text, and Statement questions
- **Customizable Styling**: Full control over colors, fonts, spacing, and layout
- **Mobile-First Design**: Responsive design that works on all devices
- **Validation**: Required field validation with user feedback
- **Navigation**: Previous/Next navigation between questions
- **Event Handling**: Callbacks for completion and error handling
- **No Dependencies**: Pure vanilla JavaScript with no external libraries required

## Quick Start

### 1. Include the Script

```html
<script src="survey-widget-vanilla.js"></script>
```

### 2. Create a Container

```html
<div id="survey-container"></div>
```

### 3. Initialize the Widget

```javascript
const surveyWidget = window.initSurveyWidget({
    surveyData: {
        id: 'my-survey',
        name: 'Customer Feedback',
        status: 'published',
        questions: [
            {
                id: 'q1',
                title: 'How satisfied are you?',
                format: 'STAR_RATING',
                required: true,
                order: 1,
                options: []
            }
        ]
    },
    onComplete: (responses) => {
        console.log('Survey completed!', responses);
    },
    onError: (error) => {
        console.error('Survey error:', error);
    }
});

surveyWidget.mount('survey-container');
```

## API Reference

### SurveyWidget Constructor

```javascript
new SurveyWidget(options)
```

#### Options

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `surveyId` | string | No* | ID of the survey to load from API |
| `surveyData` | object | No* | Survey data object (see Survey Data Structure) |
| `testMode` | boolean | No | Enable test mode (default: false) |
| `onComplete` | function | No | Callback when survey is completed |
| `onError` | function | No | Callback when an error occurs |

*Either `surveyId` or `surveyData` must be provided.

### Survey Data Structure

```javascript
{
    id: string,
    name: string,
    description?: string,
    status: 'draft' | 'published' | 'archived',
    questions: [
        {
            id: string,
            title: string,
            description?: string,
            format: 'YES_NO' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'STAR_RATING' | 'LONG_TEXT' | 'STATEMENT',
            required: boolean,
            order: number,
            yesLabel?: string,        // For YES_NO format
            noLabel?: string,         // For YES_NO format
            buttonLabel?: string,     // For STATEMENT format
            options: [                // For SINGLE_CHOICE and MULTIPLE_CHOICE
                {
                    id: string,
                    text: string,
                    order: number,
                    isOther: boolean
                }
            ]
        }
    ],
    style?: {
        backgroundColor: string,
        textColor: string,
        buttonBackgroundColor: string,
        buttonTextColor: string,
        margin: string,
        padding: string,
        border: string,
        borderRadius: string,
        titleFontSize: string,
        bodyFontSize: string,
        fontFamily: string
    }
}
```

### Methods

#### `mount(containerId)`
Mounts the survey widget to a DOM element with the specified ID.

```javascript
surveyWidget.mount('my-survey-container');
```

#### `unmount()`
Removes the survey widget from the DOM.

```javascript
surveyWidget.unmount();
```

#### `getResponses()`
Returns the current survey responses.

```javascript
const responses = surveyWidget.getResponses();
console.log(responses);
```

#### `setSurveyData(surveyData)`
Updates the survey data and re-renders the widget.

```javascript
surveyWidget.setSurveyData(newSurveyData);
```

### Response Format

Each response object has the following structure:

```javascript
{
    questionId: string,
    optionId?: string,           // For choice-based questions
    textValue?: string,          // For text-based questions
    numberValue?: number,        // For star rating questions
    booleanValue?: boolean,      // For yes/no questions
    isOther?: boolean           // True if "Other" option was selected
}
```

## Question Types

### YES_NO
Simple yes/no question with customizable labels.

```javascript
{
    id: 'q1',
    title: 'Do you like our product?',
    format: 'YES_NO',
    required: true,
    order: 1,
    yesLabel: 'Yes, I love it!',
    noLabel: 'No, not really',
    options: []
}
```

### SINGLE_CHOICE
Single selection from multiple options.

```javascript
{
    id: 'q2',
    title: 'What is your favorite color?',
    format: 'SINGLE_CHOICE',
    required: true,
    order: 2,
    options: [
        { id: 'red', text: 'Red', order: 1, isOther: false },
        { id: 'blue', text: 'Blue', order: 2, isOther: false },
        { id: 'other', text: 'Other', order: 3, isOther: true }
    ]
}
```

### MULTIPLE_CHOICE
Multiple selections from options.

```javascript
{
    id: 'q3',
    title: 'Which features do you use?',
    format: 'MULTIPLE_CHOICE',
    required: false,
    order: 3,
    options: [
        { id: 'feature1', text: 'Feature A', order: 1, isOther: false },
        { id: 'feature2', text: 'Feature B', order: 2, isOther: false },
        { id: 'other', text: 'Other', order: 3, isOther: true }
    ]
}
```

### STAR_RATING
1-5 star rating system.

```javascript
{
    id: 'q4',
    title: 'Rate your experience',
    format: 'STAR_RATING',
    required: true,
    order: 4,
    options: []
}
```

### LONG_TEXT
Multi-line text input.

```javascript
{
    id: 'q5',
    title: 'Any additional comments?',
    format: 'LONG_TEXT',
    required: false,
    order: 5,
    options: []
}
```

### STATEMENT
Display-only statement (no input required).

```javascript
{
    id: 'q6',
    title: 'Thank you!',
    description: 'Your feedback is valuable to us.',
    format: 'STATEMENT',
    required: false,
    order: 6,
    options: []
}
```

## Styling

The widget supports extensive customization through the `style` object:

```javascript
{
    backgroundColor: '#ffffff',        // Background color
    textColor: '#1f2937',             // Text color
    buttonBackgroundColor: '#3b82f6', // Button background
    buttonTextColor: '#ffffff',       // Button text color
    margin: '16px 0px',               // Outer margins
    padding: '24px',                  // Inner padding
    border: '1px solid #e5e7eb',     // Border style
    borderRadius: '8px',              // Border radius
    titleFontSize: '20px',            // Question title font size
    bodyFontSize: '16px',             // Description font size
    fontFamily: 'Inter, sans-serif'   // Font family
}
```

## Data Attributes Usage

You can also initialize surveys using HTML data attributes:

```html
<div data-survey-widget 
     data-survey-id="my-survey" 
     data-test-mode="true">
</div>
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Examples

See `demo.html` for a complete working example with different themes and question types.

## License

This widget is part of the MeuSurvey project and follows the same license terms.
