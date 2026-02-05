# Requirements Document

## Introduction

This document specifies the requirements for integrating real backend audio analysis into the VakyaGuard application. The system currently uses mock analysis data and needs to be updated to send recorded audio files to the backend API and display real analysis results.

## Glossary

- **Audio_Blob**: Binary audio data captured from user's microphone or uploaded file
- **Analysis_API**: Backend endpoint that processes audio and returns analysis results
- **Form_Data**: HTTP multipart/form-data format for file uploads
- **Results_State**: Frontend state containing analysis results from backend
- **Error_State**: Frontend state indicating analysis failure with user-friendly message

## Requirements

### Requirement 1: Audio File Upload Integration

**User Story:** As a user, I want my recorded or uploaded audio to be sent to the backend for analysis, so that I receive real analysis results instead of mock data.

#### Acceptance Criteria

1. WHEN a user completes a live recording, THE Audio_Upload_System SHALL create a FormData object containing the recorded audio blob
2. WHEN a user uploads an audio file, THE Audio_Upload_System SHALL create a FormData object containing the selected file
3. WHEN FormData is created, THE Audio_Upload_System SHALL append the audio data with the key "file"
4. WHEN audio analysis is triggered, THE Audio_Upload_System SHALL send a POST request to the Analysis_API endpoint
5. THE Audio_Upload_System SHALL set the correct Content-Type header for multipart/form-data uploads

### Requirement 2: Backend API Communication

**User Story:** As a developer, I want the frontend to communicate with the backend API correctly, so that audio files are processed and results are returned.

#### Acceptance Criteria

1. WHEN sending analysis requests, THE API_Client SHALL POST to "http://localhost:8000/analyze" endpoint
2. WHEN making API requests, THE API_Client SHALL include required authentication headers if needed
3. WHEN the backend processes the request, THE API_Client SHALL await the JSON response
4. WHEN the response is received, THE API_Client SHALL validate the response format matches expected schema
5. THE API_Client SHALL handle HTTP status codes appropriately (200, 400, 401, 500)

### Requirement 3: Results State Management

**User Story:** As a user, I want to see real analysis results from the backend, so that I can trust the authenticity assessment.

#### Acceptance Criteria

1. WHEN backend analysis completes successfully, THE Results_Manager SHALL store the response in analysis result state
2. WHEN results are stored, THE Results_Manager SHALL remove any existing mock analysis data
3. WHEN the Results Page renders, THE Results_Manager SHALL populate the display using backend data
4. WHEN backend returns probabilities, THE Results_Manager SHALL update the pie chart with real values
5. WHEN backend returns verdict and confidence, THE Results_Manager SHALL display the actual assessment

### Requirement 4: Dynamic Results Display

**User Story:** As a user, I want the results page to show my actual analysis data, so that I can see the real assessment of my audio.

#### Acceptance Criteria

1. WHEN displaying results, THE Results_Display SHALL render pie chart using backend probability values
2. WHEN showing verdict, THE Results_Display SHALL display the backend-provided verdict text
3. WHEN showing confidence, THE Results_Display SHALL display the backend-provided confidence percentage
4. WHEN showing explanation, THE Results_Display SHALL display the backend-provided explanation text
5. THE Results_Display SHALL update all visual elements dynamically based on backend response

### Requirement 5: Error Handling and Recovery

**User Story:** As a user, I want to see helpful error messages when analysis fails, so that I understand what went wrong and can try again.

#### Acceptance Criteria

1. WHEN the backend is unreachable, THE Error_Handler SHALL display a graceful error message
2. WHEN the backend returns an error response, THE Error_Handler SHALL show the error details to the user
3. WHEN analysis fails, THE Error_Handler SHALL NOT crash the application
4. WHEN errors occur, THE Error_Handler SHALL log error details to the browser console for debugging
5. WHEN in error state, THE Error_Handler SHALL provide a way for users to retry the analysis

### Requirement 6: State Cleanup and Management

**User Story:** As a developer, I want clean state management without unused variables, so that the code is maintainable and TypeScript compilation succeeds.

#### Acceptance Criteria

1. WHEN implementing backend integration, THE State_Manager SHALL remove all mock analysis data variables
2. WHEN updating state management, THE State_Manager SHALL ensure no unused state variables remain
3. WHEN code is compiled, THE TypeScript_Compiler SHALL pass without errors
4. WHEN building for production, THE Build_System SHALL succeed with "npm run build"
5. THE State_Manager SHALL maintain clean separation between recording logic and analysis logic

### Requirement 7: Backend Endpoint Compatibility

**User Story:** As a system integrator, I want the frontend to work with the existing backend API, so that no backend changes are required.

#### Acceptance Criteria

1. THE Frontend_Client SHALL send requests compatible with existing "/analyze" endpoint
2. THE Frontend_Client SHALL handle the current backend response format correctly
3. WHEN backend returns VoiceAnalysisResponse format, THE Frontend_Client SHALL parse it correctly
4. THE Frontend_Client SHALL work with the existing authentication mechanism
5. THE Frontend_Client SHALL maintain compatibility with current backend data structures

### Requirement 8: Recording Logic Preservation

**User Story:** As a user, I want the recording functionality to work exactly as before, so that my user experience is not disrupted.

#### Acceptance Criteria

1. THE Recording_System SHALL maintain all existing recording functionality unchanged
2. THE Recording_System SHALL preserve the current phase flow (landing → recording → analyzing → results)
3. WHEN users record audio, THE Recording_System SHALL capture audio exactly as before
4. WHEN users upload files, THE Recording_System SHALL handle file selection exactly as before
5. THE Recording_System SHALL maintain all existing UI interactions and animations