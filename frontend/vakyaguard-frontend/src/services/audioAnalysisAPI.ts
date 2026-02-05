// API client for backend audio analysis integration
// Handles HTTP communication with the VakyaGuard backend

// Backend API Response Interface (matches backend schema)
export interface BackendAnalysisResponse {
  decision: 'BONAFIDE' | 'SPOOF';
  scores: {
    authenticity_score: number;
    confidence: number;
  };
  provenance: {
    human_probability: number;
    synthetic_probability: number;
  };
  technicalDetails: {
    spectralAnomalies: string[];
    temporalInconsistencies: string[];
    syntheticArtifacts: string[];
  };
  explanation: string;
  summary: string;
}

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000',
  timeout: 30000, // 30 seconds for audio processing
  headers: {
    // No API key required for the simplified backend
  },
};

// API Client Class
export class AudioAnalysisAPI {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.headers = API_CONFIG.headers;
  }

  /**
   * Upload audio file to backend for analysis
   * @param audioData - Audio blob or file to analyze
   * @returns Promise resolving to backend analysis response
   */
  async uploadAudio(audioData: Blob | File): Promise<BackendAnalysisResponse> {
    const formData = this.createFormData(audioData);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      // Only include headers if they exist
      const requestOptions: RequestInit = {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      };
      
      // Add headers only if they exist
      if (Object.keys(this.headers).length > 0) {
        requestOptions.headers = this.headers;
      }

      console.log('🚀 Sending request to:', `${this.baseURL}/analyze`);
      console.log('📦 FormData keys:', Array.from(formData.keys()));
      
      const response = await fetch(`${this.baseURL}/analyze`, requestOptions);

      clearTimeout(timeoutId);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Backend response data:', data);
      this.validateResponse(data);
      return data;
    } catch (error) {
      console.error('❌ API call failed:', error);
      
      // Check if it's a network connectivity issue
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🔌 Network Error: Cannot connect to backend at', this.baseURL);
        console.error('💡 Using mock data for testing...');
        
        // Return mock data for testing
        const mockResponse: BackendAnalysisResponse = {
          decision: "SPOOF",
          scores: {
            authenticity_score: 0.14,
            confidence: 0.92
          },
          provenance: {
            human_probability: 0.14,
            synthetic_probability: 0.86
          },
          technicalDetails: {
            spectralAnomalies: [
              "AASIST confidence: 90.0%",
              "Spectral analysis weight: 40%"
            ],
            temporalInconsistencies: [
              "HFI confidence: 87.0%",
              "Temporal analysis weight: 35%"
            ],
            syntheticArtifacts: [
              "TNS confidence: 85.0%",
              "Synthesis detection weight: 25%"
            ]
          },
          explanation: "MOCK RESPONSE: Analysis detected multiple indicators of AI-generated speech. (Backend server not running - using test data)",
          summary: "TRACE RESULT\n\nDecision: SPOOF\n\nAuthenticity Score: 0.1400\nConfidence: 92.0%\n\nHuman Probability: 14.0%\nSynthetic Probability: 86.0%"
        };
        
        console.log('🧪 Using mock response:', mockResponse);
        return mockResponse;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Analysis request timed out. Please try with a shorter audio clip.');
        }
        throw error;
      }
      throw new Error('Unknown error occurred during analysis');
    }
  }

  /**
   * Create FormData object for audio upload
   * @param audioData - Audio blob or file
   * @returns FormData object ready for upload
   */
  createFormData(audioData: Blob | File): FormData {
    const formData = new FormData();
    
    console.log('📦 Creating FormData for audio:', {
      type: audioData.constructor.name,
      size: audioData.size,
      mimeType: audioData.type
    });
    
    if (audioData instanceof File) {
      console.log('📁 Appending File to FormData:', audioData.name);
      formData.append('file', audioData);
    } else {
      // Convert Blob to File with proper name and type
      const audioFile = new File([audioData], 'recording.webm', {
        type: audioData.type || 'audio/webm'
      });
      console.log('🎵 Converting Blob to File and appending:', audioFile.name, audioFile.type);
      formData.append('file', audioFile);
    }
    
    console.log('✅ FormData created with keys:', Array.from(formData.keys()));
    return formData;
  }

  /**
   * Validate backend response format
   * @param data - Response data to validate
   */
  private validateResponse(data: any): void {
    const requiredFields = ['decision', 'scores', 'provenance', 'technicalDetails', 'explanation'];
    
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Invalid response format: missing field '${field}'`);
      }
    }

    // Validate nested structures
    if (!data.scores || typeof data.scores !== 'object') {
      throw new Error('Invalid response format: invalid scores object');
    }

    if (!data.provenance || typeof data.provenance !== 'object') {
      throw new Error('Invalid response format: invalid provenance object');
    }

    if (!data.technicalDetails || typeof data.technicalDetails !== 'object') {
      throw new Error('Invalid response format: invalid technicalDetails object');
    }
  }
}

// Export singleton instance
export const audioAnalysisAPI = new AudioAnalysisAPI();