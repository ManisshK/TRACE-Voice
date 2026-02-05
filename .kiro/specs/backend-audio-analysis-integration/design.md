# Design Document: Backend Audio Analysis Integration

## Overview

This design outlines the integration of real backend audio analysis into the VakyaGuard React frontend. The system will replace mock analysis data with actual API calls to the FastAPI backend, handling file uploads, API communication, and dynamic results display while maintaining the existing user experience.

## Architecture

### High-Level Flow
```
User Action (Record/Upload) → Audio Blob/File → FormData Creation → 
API Request → Backend Processing → JSON Response → State Update → 
Results Display
```

### Component Interaction
- **App Component**: Orchestrates the overall flow and state management
- **Audio Upload Service**: Handles FormData creation and API communication  
- **Results Manager**: Processes backend responses and updates display state
- **Error Handler**: Manages error states and user feedback
- **ResultDial Component**: Renders dynamic results from backend data

## Components and Interfaces

### Audio Upload Service

**Purpose**: Handle audio file uploads and API communication

**Interface**:
```typescript
interface AudioUploadService {
  uploadAudio(audioData: Blob | File): Promise<AnalysisResponse>;
  createFormData(audioData: Blob | File): FormData;
}

interface AnalysisResponse {
  decision: 'AUTHENTIC' | 'SYNTHETIC' | 'UNCERTAIN';
  scores: {
    authenticity_score: number;
    trust_index: number;
    confidence: number;
  };
  provenance: {
    human_probability: number;
    synthetic_probability: number;
  };
  signals: {
    aasist: { confidence: number; weight: number };
    hfi: { confidence: number; weight: number };
    tns: { confidence: number; weight: number };
  };
  explanation: string;
}
```

**Key Methods**:
- `createFormData()`: Creates multipart/form-data with audio file
- `uploadAudio()`: Sends POST request to backend API
- `handleResponse()`: Processes and validates API response

### Results State Manager

**Purpose**: Manage analysis results state and coordinate updates

**Interface**:
```typescript
interface ResultsState {
  isLoading: boolean;
  data: AnalysisResponse | null;
  error: string | null;
}

interface ResultsManager {
  setAnalysisResults(data: AnalysisResponse): void;
  setError(error: string): void;
  clearResults(): void;
  transformToDisplayFormat(data: AnalysisResponse): DisplayResults;
}
```

### Error Handler

**Purpose**: Manage error states and user-friendly error messages

**Interface**:
```typescript
interface ErrorHandler {
  handleNetworkError(error: Error): string;
  handleAPIError(status: number, message: string): string;
  logError(error: Error, context: string): void;
}
```

### API Client Configuration

**Purpose**: Configure HTTP client for backend communication

**Configuration**:
```typescript
interface APIConfig {
  baseURL: string; // 'http://localhost:8000'
  timeout: number; // 30000ms for audio processing
  headers: {
    'Content-Type': 'multipart/form-data';
    // Additional headers as needed
  };
}
```

## Data Models

### Frontend Analysis Results (Current)
```typescript
interface CurrentAnalysisResults {
  syntheticProbability: number;
  verdict: 'LIKELY SYNTHETIC' | 'LIKELY HUMAN' | 'INCONCLUSIVE';
  confidence: number;
  explanation: string;
  technicalDetails: {
    biometricScore: number;
    temporalScore: number;
    spectralScore: number;
    forensicScore: number;
  };
}
```

### Backend API Response (Target)
```typescript
interface BackendAnalysisResponse {
  decision: 'AUTHENTIC' | 'SYNTHETIC' | 'UNCERTAIN';
  scores: {
    authenticity_score: number;
    trust_index: number;
    confidence: number;
  };
  provenance: {
    human_probability: number;
    synthetic_probability: number;
  };
  signals: {
    aasist: { confidence: number; weight: number };
    hfi: { confidence: number; weight: number };
    tns: { confidence: number; weight: number };
  };
  explanation: string;
}
```

### Data Transformation Mapping
```typescript
interface DataTransformer {
  transformBackendToFrontend(backend: BackendAnalysisResponse): CurrentAnalysisResults;
}

// Mapping logic:
// syntheticProbability = backend.provenance.synthetic_probability * 100
// verdict = mapDecisionToVerdict(backend.decision)
// confidence = backend.scores.confidence * 100
// explanation = backend.explanation
// technicalDetails = mapSignalsToTechnicalDetails(backend.signals)
```

## Implementation Strategy

### Phase 1: API Integration Setup
1. Create API client utility with fetch-based HTTP client
2. Implement FormData creation for audio uploads
3. Add error handling and response validation
4. Configure API endpoint and timeout settings

### Phase 2: State Management Updates
1. Remove mock analysis data from App component
2. Add loading, success, and error states
3. Implement results state management
4. Add data transformation layer

### Phase 3: UI Integration
1. Update analysis trigger handlers to call real API
2. Implement loading states during API calls
3. Update ResultDial component to use backend data
4. Add error display components

### Phase 4: Testing and Validation
1. Test with various audio file formats
2. Validate error handling scenarios
3. Ensure TypeScript compilation passes
4. Verify production build succeeds

## API Integration Details

### Request Format
```http
POST /v1/voice/analyze HTTP/1.1
Host: localhost:8000
Content-Type: multipart/form-data
x-api-key: [API_KEY]

--boundary
Content-Disposition: form-data; name="file"; filename="audio.webm"
Content-Type: audio/webm

[BINARY_AUDIO_DATA]
--boundary--
```

### Response Handling
```typescript
const handleAnalysisResponse = async (response: Response): Promise<AnalysisResponse> => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  validateResponseSchema(data);
  return data;
};
```

### Error Scenarios
1. **Network Errors**: Connection timeout, server unreachable
2. **Authentication Errors**: Invalid or missing API key
3. **Validation Errors**: Invalid file format, file too large
4. **Processing Errors**: Backend analysis failure
5. **Response Errors**: Invalid response format, missing fields

## File Upload Implementation

### FormData Creation
```typescript
const createAudioFormData = (audioData: Blob | File): FormData => {
  const formData = new FormData();
  
  if (audioData instanceof File) {
    formData.append('file', audioData);
  } else {
    // Convert Blob to File with proper name and type
    const audioFile = new File([audioData], 'recording.webm', {
      type: audioData.type || 'audio/webm'
    });
    formData.append('file', audioFile);
  }
  
  return formData;
};
```

### Upload Progress Handling
```typescript
const uploadWithProgress = async (
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<AnalysisResponse> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress((e.loaded / e.total) * 100);
        }
      });
    }
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.open('POST', '/v1/voice/analyze');
    xhr.send(formData);
  });
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: FormData Creation Consistency
*For any* audio data (Blob or File), creating FormData should result in a FormData object containing the audio data under the "file" key with appropriate metadata
**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: API Request Format Compliance  
*For any* analysis request, the system should send a POST request to the correct endpoint with proper headers and authentication
**Validates: Requirements 1.4, 1.5, 2.1, 2.2**

### Property 3: Response Validation and Handling
*For any* API response received, the system should validate the response format and handle all HTTP status codes appropriately
**Validates: Requirements 2.4, 2.5**

### Property 4: Results State Management
*For any* successful backend response, the system should store the results in state and remove any existing mock data
**Validates: Requirements 3.1, 3.2**

### Property 5: Dynamic Results Display
*For any* backend analysis results, the display should render all visual elements (pie chart, verdict, confidence, explanation) using the actual backend data
**Validates: Requirements 3.3, 3.4, 3.5**

### Property 6: Error Handling Robustness
*For any* error condition (network failure, API error, processing failure), the system should display appropriate error messages, log details, and not crash the application
**Validates: Requirements 5.2, 5.3, 5.4**

### Property 7: Backend Compatibility
*For any* request sent to the backend, the format should be compatible with the existing API endpoint and authentication mechanism
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 8: Recording Functionality Preservation
*For any* recording or upload operation, the existing functionality should work exactly as before the backend integration
**Validates: Requirements 8.1, 8.2**

## Error Handling

### Error Categories and Responses

**Network Errors**:
- Connection timeout → "Unable to connect to analysis service. Please check your connection and try again."
- Server unreachable → "Analysis service is currently unavailable. Please try again later."
- DNS resolution failure → "Cannot reach analysis service. Please check your network connection."

**Authentication Errors**:
- Missing API key → "Authentication configuration error. Please contact support."
- Invalid API key → "Authentication failed. Please verify your credentials."
- Expired token → "Session expired. Please refresh and try again."

**Validation Errors**:
- Invalid file format → "Unsupported audio format. Please use MP3 or WAV files."
- File too large → "Audio file is too large. Maximum size is 10MB."
- Empty file → "Audio file appears to be empty. Please select a valid recording."

**Processing Errors**:
- Analysis timeout → "Analysis is taking longer than expected. Please try with a shorter audio clip."
- Backend processing failure → "Analysis failed due to a processing error. Please try again."
- Insufficient audio data → "Audio clip is too short for analysis. Minimum duration is 1 second."

**Response Errors**:
- Invalid JSON → "Received invalid response from analysis service. Please try again."
- Missing required fields → "Analysis response is incomplete. Please retry the analysis."
- Unexpected format → "Analysis service returned unexpected data format."

### Error Recovery Strategies

**Automatic Retry**:
- Network timeouts: Retry up to 3 times with exponential backoff
- Temporary server errors (5xx): Retry up to 2 times after 5-second delay

**User-Initiated Retry**:
- All error states provide "Try Again" button
- Retry preserves the same audio data without re-recording
- Clear error state before retry attempt

**Graceful Degradation**:
- Never crash the application on errors
- Always return to a recoverable state
- Preserve user's audio data for retry attempts
- Log detailed error information for debugging

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Test specific file formats (MP3, WAV, WebM)
- Test specific error scenarios (404, 500, timeout)
- Test UI state transitions and error displays
- Test authentication header inclusion
- Test FormData structure for known inputs

**Property Tests**: Verify universal properties across all inputs  
- Test FormData creation for any audio input (Property 1)
- Test API request format for any analysis request (Property 2)
- Test response handling for any API response (Property 3)
- Test results display for any backend data (Property 5)
- Test error handling for any error condition (Property 6)

**Property-Based Testing Configuration**:
- Use a property-based testing library (e.g., fast-check for TypeScript)
- Configure each test to run minimum 100 iterations
- Each property test references its design document property
- Tag format: **Feature: backend-audio-analysis-integration, Property {number}: {property_text}**

**Integration Testing**:
- Test end-to-end flow from audio upload to results display
- Test with real backend API in development environment
- Test error scenarios with mocked backend responses
- Test file upload progress and timeout handling

**Performance Testing**:
- Test upload performance with various file sizes
- Test timeout handling for long-running analysis
- Test memory usage during file upload and processing
- Test UI responsiveness during API calls

### Test Coverage Requirements

**Functional Coverage**:
- All API endpoints and methods
- All error conditions and recovery paths
- All data transformation logic
- All UI state transitions

**Edge Case Coverage**:
- Empty files and zero-byte uploads
- Maximum file size uploads
- Network interruption during upload
- Malformed API responses
- Concurrent analysis requests

**Browser Compatibility**:
- Test FormData creation across browsers
- Test fetch API compatibility
- Test audio Blob handling differences
- Test error display consistency