// Test script to verify backend connection and API functionality
// Run this in the browser console to test the backend integration

export const testBackendConnection = async () => {
  console.log('🧪 Testing Backend Connection...');
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch('http://127.0.0.1:8000/');
    const healthData = await healthResponse.json();
    console.log(`✅ Health check: ${healthResponse.status}`, healthData);
    
    // Test 2: Create mock audio file and test analyze endpoint
    console.log('\n2. Testing analyze endpoint with mock audio...');
    
    // Create a mock audio blob
    const mockAudioData = new Uint8Array(1024).fill(0); // 1KB of zeros
    const audioBlob = new Blob([mockAudioData], { type: 'audio/webm' });
    
    // Create FormData
    const formData = new FormData();
    const audioFile = new File([audioBlob], 'test-recording.webm', {
      type: 'audio/webm'
    });
    formData.append('file', audioFile);
    
    // Send to analyze endpoint
    const analyzeResponse = await fetch('http://127.0.0.1:8000/v1/voice/analyze', {
      method: 'POST',
      body: formData
    });
    
    if (analyzeResponse.ok) {
      const analyzeData = await analyzeResponse.json();
      console.log(`✅ Analyze endpoint: ${analyzeResponse.status}`);
      console.log('📊 Response data:', analyzeData);
      
      // Verify response structure
      const requiredFields = ['decision', 'scores', 'provenance', 'signals', 'explanation'];
      const missingFields = requiredFields.filter(field => !(field in analyzeData));
      
      if (missingFields.length === 0) {
        console.log('✅ Response structure is correct');
        console.log(`   Decision: ${analyzeData.decision}`);
        console.log(`   Synthetic probability: ${analyzeData.provenance.synthetic_probability}`);
        console.log(`   Confidence: ${analyzeData.scores.confidence}`);
      } else {
        console.log(`❌ Missing fields in response: ${missingFields.join(', ')}`);
      }
    } else {
      console.log(`❌ Analyze endpoint failed: ${analyzeResponse.status}`);
      const errorText = await analyzeResponse.text();
      console.log('Error response:', errorText);
    }
    
    console.log('\n🎉 Backend connection test completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Backend connection test failed:', error);
    console.log('\n💡 Make sure the backend is running:');
    console.log('   cd backend');
    console.log('   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000');
    return false;
  }
};

// Make it available in browser console
(window as any).testBackendConnection = testBackendConnection;

// Auto-run test when imported
console.log('🔗 Backend connection test loaded. Run testBackendConnection() to test.');