# Implementation Plan: Backend Audio Analysis Integration

## Overview

This implementation plan converts the mock analysis system in the VakyaGuard React frontend to use real backend API calls. The tasks are structured to incrementally build the integration while maintaining existing functionality and ensuring robust error handling.

## Tasks

- [x] 1. Create API client infrastructure
  - Create `src/services/audioAnalysisAPI.ts` with HTTP client utilities
  - Define TypeScript interfaces for API requests and responses
  - Implement base API configuration (endpoint URL, timeout, headers)
  - _Requirements: 2.1, 2.2, 7.1, 7.4_

- [ ]* 1.1 Write property test for API client configuration
  - **Property 2: API Request Format Compliance**
  - **Validates: Requirements 1.4, 1.5, 2.1, 2.2**

- [ ] 2. Implement FormData creation service
  - [x] 2.1 Create `src/services/audioUploadService.ts` with FormData utilities
    - Implement `createFormData()` function for Blob and File inputs
    - Add proper file naming and MIME type handling
    - Handle both recorded audio blobs and uploaded files
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 2.2 Write property test for FormData creation
    - **Property 1: FormData Creation Consistency**
    - **Validates: Requirements 1.1, 1.2, 1.3**

- [ ] 3. Implement backend API communication
  - [x] 3.1 Add audio upload method to API service
    - Implement `uploadAudio()` function with fetch API
    - Handle multipart/form-data uploads
    - Add request timeout and progress tracking
    - _Requirements: 1.4, 1.5, 2.1, 2.2_

  - [x] 3.2 Add response validation and parsing
    - Implement response schema validation
    - Add JSON parsing with error handling
    - Map backend response to frontend data structures
    - _Requirements: 2.3, 2.4, 7.2, 7.3_

  - [ ]* 3.3 Write property test for response handling
    - **Property 3: Response Validation and Handling**
    - **Validates: Requirements 2.4, 2.5**

- [ ] 4. Implement comprehensive error handling
  - [x] 4.1 Create error handling utilities
    - Implement `src/services/errorHandler.ts` with error categorization
    - Add user-friendly error message mapping
    - Implement console logging for debugging
    - _Requirements: 5.1, 5.2, 5.4_

  - [x] 4.2 Add error recovery mechanisms
    - Implement retry logic for network failures
    - Add graceful error state management
    - Ensure application never crashes on errors
    - _Requirements: 5.3, 5.5_

  - [ ]* 4.3 Write property test for error handling
    - **Property 6: Error Handling Robustness**
    - **Validates: Requirements 5.2, 5.3, 5.4**

- [ ] 5. Update App component state management
  - [x] 5.1 Remove mock analysis data
    - Delete hardcoded `analysisResults` state object
    - Remove mock analysis timer and stage simulation
    - Clean up unused state variables
    - _Requirements: 6.1, 3.2_

  - [x] 5.2 Add real analysis state management
    - Add loading, success, and error states for analysis
    - Implement results state with backend response structure
    - Add data transformation layer for display compatibility
    - _Requirements: 3.1, 3.2_

  - [ ]* 5.3 Write property test for results state management
    - **Property 4: Results State Management**
    - **Validates: Requirements 3.1, 3.2**

- [ ] 6. Checkpoint - Ensure core integration works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Update analysis trigger handlers
  - [x] 7.1 Modify file upload analysis handler
    - Update `handleAnalyzeClick()` to call real API
    - Add loading state management during API calls
    - Handle success and error responses
    - _Requirements: 1.4, 3.1_

  - [x] 7.2 Modify live recording analysis handler  
    - Update `handleAnalyzeRecording()` to call real API
    - Ensure recorded blob is properly formatted for upload
    - Maintain existing recording functionality
    - _Requirements: 1.1, 8.1, 8.2_

  - [ ]* 7.3 Write property test for recording functionality preservation
    - **Property 8: Recording Functionality Preservation**
    - **Validates: Requirements 8.1, 8.2**

- [ ] 8. Update ResultDial component for dynamic data
  - [x] 8.1 Modify ResultDial to accept backend response format
    - Update component props to handle backend data structure
    - Add data transformation logic within component
    - Ensure backward compatibility with existing interface
    - _Requirements: 3.3, 3.4, 3.5_

  - [x] 8.2 Update result display calculations
    - Map backend probabilities to pie chart values
    - Transform backend verdict to display format
    - Update confidence and explanation display
    - _Requirements: 3.4, 3.5_

  - [ ]* 8.3 Write property test for dynamic results display
    - **Property 5: Dynamic Results Display**
    - **Validates: Requirements 3.3, 3.4, 3.5**

- [ ] 9. Add loading and error UI states
  - [x] 9.1 Implement loading state UI
    - Add loading indicators during API calls
    - Update analysis progress display to show real progress
    - Maintain existing animation system during loading
    - _Requirements: 2.3_

  - [x] 9.2 Implement error state UI
    - Add error message display components
    - Implement retry button functionality
    - Ensure error states are user-friendly and actionable
    - _Requirements: 5.1, 5.2, 5.5_

- [ ]* 9.3 Write unit tests for UI error states
  - Test error message display for different error types
  - Test retry button functionality
  - _Requirements: 5.1, 5.5_

- [ ] 10. Add backend compatibility validation
  - [x] 10.1 Validate API endpoint compatibility
    - Ensure requests match existing backend `/v1/voice/analyze` endpoint
    - Verify authentication header format matches backend expectations
    - Test with actual backend response format
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ]* 10.2 Write property test for backend compatibility
    - **Property 7: Backend Compatibility**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [ ] 11. Final integration and cleanup
  - [x] 11.1 Remove all mock data references
    - Ensure no hardcoded analysis results remain
    - Clean up unused imports and variables
    - Verify TypeScript compilation passes
    - _Requirements: 6.1, 6.3_

  - [x] 11.2 Test production build
    - Run `npm run build` to ensure production build succeeds
    - Verify all TypeScript errors are resolved
    - Test built application functionality
    - _Requirements: 6.4_

- [ ]* 11.3 Write integration tests
  - Test complete flow from audio upload to results display
  - Test error scenarios with mocked backend responses
  - _Requirements: 1.4, 3.1, 3.3_

- [x] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation preserves all existing recording and UI functionality
- Backend compatibility is maintained throughout the integration