// Debug script to test the exact API call that's failing
// This will help identify the specific issue

export const debugAPICall = async () => {
  console.log('🔍 Debugging API Call...');
  
  try {
    // Test 1: Simple health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch('http://127.0.0.1:8000/');
    console.log(`Health status: ${healthResponse.status}`);
    const healthData = await healthResponse.json();
    console.log('Health data:', healthData);
    
    // Test 2: Test the exact FormData creation that the frontend uses
    console.log('\n2. Testing FormData creation...');
    
    // Create a test audio blob (same as frontend)
    const testAudioData = new Uint8Array(1024).fill(65); // Fill with 'A' characters
    const audioBlob = new Blob([testAudioData], { type: 'audio/webm' });
    console.log(`Created blob: size=${audioBlob.size}, type=${audioBlob.type}`);
    
    // Create FormData exactly like the frontend does
    const formData = new FormData();
    const audioFile = new File([audioBlob], 'recording.webm', {
      type: audioBlob.type || 'audio/webm'
    });
    formData.append('file', audioFile);
    console.log('FormData created with file key');
    
    // Test 3: Test both endpoints
    const endpoints = [
      'http://127.0.0.1:8000/analyze',
      'http://127.0.0.1:8000/v1/voice/analyze'
    ];
    
    for (const endpoint of endpoints) {
      console.log(`\n3. Testing ${endpoint}...`);
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData
        });
        
        console.log(`Response status: ${response.status}`);
        console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ SUCCESS! Response data:', data);
        } else {
          const errorText = await response.text();
          console.log(`❌ FAILED! Error response:`, errorText);
        }
      } catch (error) {
        console.log(`❌ NETWORK ERROR:`, error);
      }
      
      // Recreate FormData for next test (FormData can only be used once)
      formData.delete('file');
      formData.append('file', audioFile);
    }
    
    // Test 4: Test with different file types
    console.log('\n4. Testing different file types...');
    
    const fileTypes = [
      { type: 'audio/webm', name: 'test.webm' },
      { type: 'audio/wav', name: 'test.wav' },
      { type: 'audio/mp3', name: 'test.mp3' }
    ];
    
    for (const fileType of fileTypes) {
      console.log(`\nTesting ${fileType.type}...`);
      
      const testBlob = new Blob([testAudioData], { type: fileType.type });
      const testFile = new File([testBlob], fileType.name, { type: fileType.type });
      const testFormData = new FormData();
      testFormData.append('file', testFile);
      
      try {
        const response = await fetch('http://127.0.0.1:8000/analyze', {
          method: 'POST',
          body: testFormData
        });
        
        console.log(`${fileType.type}: ${response.status} ${response.ok ? '✅' : '❌'}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log(`Error: ${errorText}`);
        }
      } catch (error) {
        console.log(`${fileType.type}: Network error -`, error);
      }
    }
    
    console.log('\n🎯 Debug complete!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
};

// Make available in browser console
(window as any).debugAPICall = debugAPICall;

console.log('🔍 Debug API call loaded. Run debugAPICall() to test.');