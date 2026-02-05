// Simple test to verify backend connection
async function testBackendConnection() {
    console.log('🔍 Testing backend connection...');
    
    try {
        // Test health endpoint
        const healthResponse = await fetch('http://127.0.0.1:8000/');
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData);
        
        // Test analyze endpoint with a simple FormData
        const formData = new FormData();
        const testBlob = new Blob(['test audio data'], { type: 'audio/wav' });
        formData.append('file', testBlob, 'test.wav');
        
        console.log('📤 Testing /analyze endpoint...');
        const analyzeResponse = await fetch('http://127.0.0.1:8000/analyze', {
            method: 'POST',
            body: formData
        });
        
        if (analyzeResponse.ok) {
            const analyzeData = await analyzeResponse.json();
            console.log('✅ Analyze endpoint response:', analyzeData);
            console.log('🎉 Backend integration is working!');
        } else {
            console.error('❌ Analyze endpoint failed:', analyzeResponse.status, analyzeResponse.statusText);
        }
        
    } catch (error) {
        console.error('❌ Connection test failed:', error);
    }
}

// Run the test
testBackendConnection();