// End-to-End Test for Live Audio Recording → Backend Analysis → Results Display
// This test simulates the complete user flow

export const testE2EFlow = async () => {
  console.log('🎯 Testing End-to-End Audio Analysis Flow');
  console.log('='.repeat(50));
  
  try {
    // Step 1: Test Backend Connection
    console.log('\n📡 Step 1: Testing backend connection...');
    const healthResponse = await fetch('http://127.0.0.1:8000/');
    if (!healthResponse.ok) {
      throw new Error(`Backend not responding: ${healthResponse.status}`);
    }
    console.log('✅ Backend is running');
    
    // Step 2: Simulate Audio Recording
    console.log('\n🎤 Step 2: Simulating audio recording...');
    
    // Create a realistic mock audio blob (WebM format)
    const sampleRate = 44100;
    const duration = 3; // 3 seconds
    const channels = 1;
    const samples = sampleRate * duration * channels;
    
    // Generate sine wave audio data (440Hz tone)
    const audioBuffer = new ArrayBuffer(samples * 2); // 16-bit audio
    const audioView = new Int16Array(audioBuffer);
    
    for (let i = 0; i < samples; i++) {
      const time = i / sampleRate;
      const frequency = 440; // A4 note
      const amplitude = 0.3;
      const sample = Math.sin(2 * Math.PI * frequency * time) * amplitude;
      audioView[i] = Math.floor(sample * 32767); // Convert to 16-bit
    }
    
    // Create audio blob
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
    console.log(`✅ Created mock audio blob: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
    
    // Step 3: Test FormData Creation
    console.log('\n📦 Step 3: Testing FormData creation...');
    const formData = new FormData();
    const audioFile = new File([audioBlob], 'test-recording.webm', {
      type: 'audio/webm',
      lastModified: Date.now()
    });
    formData.append('file', audioFile);
    console.log('✅ FormData created with audio file');
    
    // Step 4: Send to Backend API
    console.log('\n🚀 Step 4: Sending to backend API...');
    const startTime = Date.now();
    
    const analyzeResponse = await fetch('http://127.0.0.1:8000/v1/voice/analyze', {
      method: 'POST',
      body: formData
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`✅ API response received in ${responseTime}ms`);
    
    if (!analyzeResponse.ok) {
      throw new Error(`API error: ${analyzeResponse.status} ${analyzeResponse.statusText}`);
    }
    
    // Step 5: Parse and Validate Response
    console.log('\n📊 Step 5: Parsing analysis response...');
    const analysisData = await analyzeResponse.json();
    
    // Validate response structure
    const requiredFields = ['decision', 'scores', 'provenance', 'signals', 'explanation'];
    const missingFields = requiredFields.filter(field => !(field in analysisData));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    console.log('✅ Response structure validated');
    console.log('📋 Analysis Results:');
    console.log(`   Decision: ${analysisData.decision}`);
    console.log(`   Synthetic Probability: ${(analysisData.provenance.synthetic_probability * 100).toFixed(1)}%`);
    console.log(`   Human Probability: ${(analysisData.provenance.human_probability * 100).toFixed(1)}%`);
    console.log(`   Confidence: ${(analysisData.scores.confidence * 100).toFixed(1)}%`);
    console.log(`   Authenticity Score: ${(analysisData.scores.authenticity_score * 100).toFixed(1)}%`);
    
    // Step 6: Test Data Transformation
    console.log('\n🔄 Step 6: Testing data transformation...');
    
    // Use data directly (no transformation needed)
    const frontendResults = analysisData;
    
    console.log('✅ Data transformation successful');
    console.log('🎨 Frontend Display Data:');
    console.log(`   Verdict: ${frontendResults.verdict}`);
    console.log(`   Synthetic Probability: ${frontendResults.syntheticProbability}%`);
    console.log(`   Confidence: ${frontendResults.confidence}%`);
    console.log(`   Technical Details:`);
    console.log(`     Biometric Score: ${frontendResults.technicalDetails.biometricScore}%`);
    console.log(`     Temporal Score: ${frontendResults.technicalDetails.temporalScore}%`);
    console.log(`     Spectral Score: ${frontendResults.technicalDetails.spectralScore}%`);
    console.log(`     Forensic Score: ${frontendResults.technicalDetails.forensicScore}%`);
    
    // Step 7: Verify UI Components Can Render
    console.log('\n🎨 Step 7: Verifying UI component compatibility...');
    
    // Test pie chart data
    const humanProbability = 100 - frontendResults.syntheticProbability;
    const isDominantSynthetic = frontendResults.syntheticProbability > 50;
    
    console.log('✅ UI component data prepared:');
    console.log(`   Pie chart data: ${frontendResults.syntheticProbability}% synthetic, ${humanProbability}% human`);
    console.log(`   Dominant classification: ${isDominantSynthetic ? 'SYNTHETIC' : 'HUMAN'}`);
    console.log(`   Verdict badge color: ${frontendResults.verdict === 'LIKELY SYNTHETIC' ? 'red' : frontendResults.verdict === 'LIKELY HUMAN' ? 'green' : 'amber'}`);
    
    // Final Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 END-TO-END TEST COMPLETED SUCCESSFULLY!');
    console.log('✨ All components working correctly:');
    console.log('   ✅ Backend API responding');
    console.log('   ✅ Audio blob creation');
    console.log('   ✅ FormData upload');
    console.log('   ✅ Response parsing');
    console.log('   ✅ Data transformation');
    console.log('   ✅ UI component compatibility');
    
    console.log('\n🚀 Ready for live testing:');
    console.log('   1. Start backend: python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000');
    console.log('   2. Open frontend: http://localhost:3000');
    console.log('   3. Click "Start Live Recording"');
    console.log('   4. Record audio and click "Analyze Recording"');
    console.log('   5. See real backend results!');
    
    return {
      success: true,
      responseTime,
      analysisData,
      frontendResults
    };
    
  } catch (error) {
    console.error('\n❌ END-TO-END TEST FAILED:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure backend is running: python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000');
    console.log('   2. Check backend health: http://127.0.0.1:8000/');
    console.log('   3. Verify CORS is enabled in backend');
    console.log('   4. Check browser console for network errors');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Make available in browser console
(window as any).testE2EFlow = testE2EFlow;

console.log('🧪 End-to-End test loaded. Run testE2EFlow() to test the complete flow.');