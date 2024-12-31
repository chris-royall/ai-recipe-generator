# AI Recipe Generator

Welcome to the **AI Recipe Generator** project! This repository highlights my experience in front-end development and AWS cloud services through the creation of a functional, AI-powered web application. The app generates recipes based on user inputs, features secure user authentication, and includes advanced logging mechanisms.

## Table of Contents

- [Deployed Application](#deployed-application)
- [Technology Stack](#technology-stack)
- [AI Workflow](#ai-workflow)
- [AppSync with GraphQL API](#appsync-with-graphql-api)
- [Logging](#logging)

## Deployed Application

You can access the live application here: [AI Recipe Generator](https://recipes.chrisroyall.com)

![Infrastructure Diagram](/src/assets/airecipegenerator-infrastructure.png)

## Technology Stack

### Frontend
- **Languages & Frameworks**:
  - React: HTML, CSS, TypeScript

### Cloud Services (AWS)
- **Hosting & Routing**: AWS Amplify, Route 53
- **Backend & APIs**:
  - **Language**: JavaScript (used in AWS AppSync functions)
  - **Services**: AppSync with GraphQL
- **Authentication**: Cognito
- **Monitoring & Analytics**: CloudWatch
- **AI**: Bedrock (Claude 3 Sonnet)

## AI Workflow

1. **User Authentication**: Users sign in or create an account using the Amplify Auth UI, which interacts with Amazon Cognito for secure authentication.
2. **Input Submission**: Users input ingredients or recipe-related details into a form.
3. **API Request**: The input is sent to a GraphQL API endpoint managed by AWS AppSync.
4. **AI Processing**: AppSync formats the input and sends it to Amazon Bedrock's Claude 3 Sonnet model for recipe generation.
5. **Response Handling**: The AI-generated recipe is processed and displayed on the front end.
6. **Logging**: Throughout the workflow, detailed logs are recorded using Amazon CloudWatch to monitor application behavior, including:
   - User inputs to ensure data is captured correctly.
   - API responses (both valid and invalid) to debug and optimise interactions.
   - Warnings for empty inputs to notify developers of potential issues.
   - System events and errors to maintain visibility into backend operations.
7. **Session Management**: Users can log out securely using the provided functionality.

## AppSync with GraphQL API

The application uses AWS AppSync to manage the GraphQL API, enabling seamless interaction between the frontend and backend.

### GraphQL Endpoint Details

- **URL**: `/graphql`
- **Method**: `POST`

### Sample Payload
```graphql
{
  "query": "query ($ingredients: [String]) {\n  askBedrock(ingredients: $ingredients) {\n    body\n    error\n  }\n}",
  "variables": {
    "ingredients": [
      "<User_Input>"
    ]
  }
}
```

## Logging

Comprehensive logging is implemented using Amazon CloudWatch to ensure visibility into application performance and user interactions.

### Key Logging Scenarios

1. **User Input**:
   ```javascript
   console.log("User Input:", ingredients);
   ```
2. **Empty Input Warning**:
   ```javascript
   console.log("Warning: No content provided.");
   ```
3. **Valid API Response**:
   ```javascript
   console.log("Raw Bedrock Response:", ctx.result.body);
   ```
4. **Invalid API Response**:
   ```javascript
   console.log("Error: Invalid response format from Bedrock API.");
   ```

### Log Retention
- Logs are stored in CloudWatch for a retention period of 7 days.
