# Survey Submission API

This API allows external applications to submit survey responses to surveys created by teams in the MeuSurvey platform.

## Overview

The API provides a secure way to collect survey responses using team tokens for authentication. Each team can generate a unique token that allows external applications to submit responses to their published surveys.

## Authentication

The API uses team tokens for authentication. Each team can generate a unique token that must be included in all API requests.

### Getting a Team Token

1. Sign in as a team administrator
2. Navigate to the team management section
3. Generate a team token using the `generateTeamTokenAction` function
4. Store the token securely for use in your external application

## API Endpoint

### Submit Survey Response

**POST** `/api/survey/v0`

Submits a survey response with question answers.

#### Request Body

```json
{
  "teamToken": "string",     // Required: Team authentication token
  "surveyId": "string",      // Required: ID of the survey to submit to
  "responses": [             // Required: Array of question responses
    {
      "questionId": "string",    // Required: ID of the question being answered
      "optionId": "string",      // Optional: ID of selected option (for choice questions)
      "textValue": "string",     // Optional: Text response value
      "numberValue": number,     // Optional: Numeric response value
      "booleanValue": boolean,   // Optional: Boolean response value
      "isOther": boolean         // Optional: Whether this is an "other" response (default: false)
    }
  ]
}
```

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Survey response submitted successfully",
  "data": {
    "responseId": "string",
    "surveyId": "string",
    "teamName": "string",
    "submittedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (400)**
```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "teamToken",
      "message": "Team token is required"
    }
  ]
}
```

**Error (401)**
```json
{
  "error": "Invalid team token"
}
```

**Error (404)**
```json
{
  "error": "Survey not found or not published"
}
```

**Error (500)**
```json
{
  "error": "Internal server error"
}
```

## Validation Rules

### Team Token Validation
- Must be a valid, non-empty string
- Must correspond to an existing team in the database
- Team must exist and be active

### Survey Validation
- Survey must exist in the database
- Survey must belong to the team associated with the token
- Survey must be in "published" status (draft surveys cannot accept submissions)

### Question Validation
- All question IDs in responses must exist in the target survey
- Required questions must be answered
- Response values must match the question format:
  - `textValue` for text-based questions
  - `numberValue` for numeric questions
  - `booleanValue` for yes/no questions
  - `optionId` for choice-based questions

### Response Format Validation
- At least one response is required
- Each response must have a valid `questionId`
- Response values should match the question type
- `isOther` flag indicates custom "other" responses

## Example Usage

### JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:3000/api/survey/v0', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    teamToken: 'your-team-token-here',
    surveyId: 'your-survey-id-here',
    responses: [
      {
        questionId: 'question-1',
        textValue: 'This is my response'
      },
      {
        questionId: 'question-2',
        optionId: 'option-1'
      },
      {
        questionId: 'question-3',
        numberValue: 5
      },
      {
        questionId: 'question-4',
        booleanValue: true
      }
    ]
  })
});

const result = await response.json();
console.log(result);
```

### cURL

```bash
curl -X POST http://localhost:3000/api/survey/v0 \
  -H "Content-Type: application/json" \
  -d '{
    "teamToken": "your-team-token-here",
    "surveyId": "your-survey-id-here",
    "responses": [
      {
        "questionId": "question-1",
        "textValue": "This is my response"
      }
    ]
  }'
```

## Question Types and Response Formats

### Text Questions
- Use `textValue` for the response
- Example: `{ "questionId": "q1", "textValue": "My answer" }`

### Yes/No Questions
- Use `booleanValue` for the response
- Example: `{ "questionId": "q2", "booleanValue": true }`

### Single Choice Questions
- Use `optionId` for the selected option
- Example: `{ "questionId": "q3", "optionId": "opt1" }`

### Multiple Choice Questions
- Submit multiple responses, one for each selected option
- Example: 
  ```json
  [
    { "questionId": "q4", "optionId": "opt1" },
    { "questionId": "q4", "optionId": "opt3" }
  ]
  ```

### Rating Questions
- Use `numberValue` for the rating
- Example: `{ "questionId": "q5", "numberValue": 5 }`

### "Other" Responses
- Use `isOther: true` and provide `textValue` for custom responses
- Example: `{ "questionId": "q6", "textValue": "Custom answer", "isOther: true }`

## Security Considerations

1. **Team Token Security**: Keep team tokens secure and don't expose them in client-side code
2. **Rate Limiting**: Consider implementing rate limiting for production use
3. **HTTPS**: Always use HTTPS in production environments
4. **Token Rotation**: Regularly regenerate team tokens for enhanced security

## Error Handling

The API returns appropriate HTTP status codes and detailed error messages:

- `400 Bad Request`: Validation errors or missing required fields
- `401 Unauthorized`: Invalid team token
- `404 Not Found`: Survey not found or not published
- `500 Internal Server Error`: Server-side errors

Always check the response status and handle errors appropriately in your application.

## Rate Limits

Currently, there are no rate limits implemented, but this should be considered for production deployments to prevent abuse.

## Support

For technical support or questions about the API, please contact the development team or refer to the main application documentation.
