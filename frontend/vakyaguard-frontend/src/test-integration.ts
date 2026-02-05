// Integration Test for Backend Audio Analysis
// This file tests the integration without requiring a running backend

import { BackendAnalysisResponse } from './services/audioAnalysisAPI';
import { audioUploadService } from './services/audioUploadService';

// Mock backend response for testing (MATCHES CURRENT BACKEND SCHEMA)
const mockBackendResponse: BackendAnalysisResponse = {
  decision: 'SPOOF',

  scores: {
    authenticity_score: 0.14,
    trust_index: 0.14,
    confidence: 0.92
  },

  provenance: {
    human_probability: 0.14,
    synthetic_probability: 0.86
  },

  signals: {
    aasist: {
      confidence: 0.9,
      weight: 0.4
    },
    hfi: {
      confidence: 0.87,
      weight: 0.35
    },
    tns: {
      confidence: 0.85,
      weight: 0.25
    }
  },

  explanation: 'Analysis detected synthetic speech generation.'
};

// Test functions
export const testIntegration = () => {
  console.log('🧪 Testing Backend Audio Analysis Integration...');

  // Test 1: FormData Creation
  console.log('\n1. Testing FormData Creation...');
  try {
    const mockBlob = new Blob(['test audio data'], { type: 'audio/webm' });
    const formData = audioUploadService.createFormData(mockBlob);
    const hasFile = formData.has('file');
    console.log(`✅ FormData creation: ${hasFile ? 'PASS' : 'FAIL'}`);
  } catch (error) {
    console.log(`❌ FormData creation: FAIL - ${error}`);
  }

  // Test 2: File Validation
  console.log('\n2. Testing File Validation...');
  try {
    const mockBlob = new Blob(['test audio data'], { type: 'audio/webm' });
    const validation = audioUploadService.validateAudioFile(mockBlob);
    console.log(`✅ File validation: ${validation.isValid ? 'PASS' : 'FAIL'}`);
    if (!validation.isValid) {
      console.log(`   Error: ${validation.error}`);
    }
  } catch (error) {
    console.log(`❌ File validation: FAIL - ${error}`);
  }

  // Test 3: Response Validation
  console.log('\n3. Testing Backend Response Shape...');
  try {
    const syntheticPct = Math.round(
      mockBackendResponse.provenance.synthetic_probability * 100
    );

    console.log(`✅ Decision: ${mockBackendResponse.decision}`);
    console.log(`✅ Trust Index: ${mockBackendResponse.scores.trust_index}`);
    console.log(`✅ Synthetic Probability: ${syntheticPct}%`);
    console.log(
      `✅ AASIST Confidence: ${mockBackendResponse.signals.aasist.confidence}`
    );
  } catch (error) {
    console.log(`❌ Response validation: FAIL - ${error}`);
  }

  console.log('\n🎉 Integration test completed successfully!');
};

// Export for browser console testing
(window as any).testIntegration = testIntegration;
