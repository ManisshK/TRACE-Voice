// Temporary mock backend response for testing
// This will help us identify if the issue is backend connectivity or something else

export const mockBackendResponse = {
  decision: "SPOOF" as const,
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
  explanation: "Analysis detected multiple indicators of AI-generated speech including unnatural temporal patterns, spectral anomalies, and missing biometric markers typical of human vocalization.",
  summary: "TRACE RESULT\n\nDecision: SPOOF\n\nAuthenticity Score: 0.1400\nConfidence: 92.0%"
};

// Function to test with mock data
export const testWithMockData = () => {
  console.log('🧪 Testing with mock backend response...');
  
  // Import the API client
  import('./services/audioAnalysisAPI').then(() => {
    try {
      // Direct use of mock response since we removed the transformation method
      console.log('✅ Mock data available:', mockBackendResponse);
      
      // Test if the results would display correctly
      console.log('🎨 Display data:');
      console.log(`   Decision: ${mockBackendResponse.decision}`);
      console.log(`   Synthetic Probability: ${(mockBackendResponse.provenance.synthetic_probability * 100).toFixed(1)}%`);
      console.log(`   Confidence: ${(mockBackendResponse.scores.confidence * 100).toFixed(1)}%`);
      console.log(`   Explanation: ${mockBackendResponse.explanation}`);
      
    } catch (error) {
      console.error('❌ Mock data transformation failed:', error);
    }
  });
};

// Make available in console
(window as any).testWithMockData = testWithMockData;
(window as any).mockBackendResponse = mockBackendResponse;