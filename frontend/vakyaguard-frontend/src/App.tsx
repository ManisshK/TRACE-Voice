import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import { analysisService } from './services/analysisService';
import { BackendAnalysisResponse } from './services/audioAnalysisAPI';
import './test-integration'; // Import integration test
import './test-backend-connection'; // Import backend connection test
import './test-e2e-flow'; // Import end-to-end flow test
import './debug-api-call'; // Import debug API call test
import './check-backend'; // Import backend health check
import './mock-backend-response'; // Import mock backend response test
import './App.css';

interface AppProps {}

type RecordingState = 'idle' | 'recording' | 'stopped';
type AppState = 'landing' | 'recording' | 'analyzing' | 'results';

const App: React.FC<AppProps> = () => {
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // App flow state
  const [appState, setAppState] = useState<AppState>('landing');
  
  // Live recording state
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  // Analysis state
  const [currentAnalysisStage, setCurrentAnalysisStage] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<BackendAnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Analysis stage progression is now handled by actual API progress
  // No timer-based simulation needed
  
  // Log analysis state for debugging
  useEffect(() => {
    if (isAnalyzing) {
      console.log('Analysis in progress...');
    }
  }, [isAnalyzing]);

  // Recording timer effect
  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // File upload handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleAnalyzeClick = async () => {
    if (selectedFile) {
      setAppState('analyzing');
      setCurrentAnalysisStage(0);
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      try {
        const results = await analysisService.analyzeAudio(selectedFile, {
          onProgress: (stage) => {
            console.log('Analysis progress:', stage);
            // Update stage based on actual progress
            if (stage.includes('Preparing')) setCurrentAnalysisStage(1);
            else if (stage.includes('Uploading')) setCurrentAnalysisStage(2);
            else if (stage.includes('Processing')) setCurrentAnalysisStage(3);
            else if (stage.includes('Analyzing')) setCurrentAnalysisStage(4);
            else if (stage.includes('Finalizing')) setCurrentAnalysisStage(5);
            else if (stage.includes('complete')) setCurrentAnalysisStage(6);
          },
          onRetry: (attempt, error) => {
            console.log(`Retry attempt ${attempt}:`, error);
          },
        });
        
        setAnalysisResults(results);
        setAppState('results');
      } catch (error) {
        console.error('Analysis failed:', error);
        setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
        setAppState('results'); // Show error state in results
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Recording handlers
  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      let stream = streamRef.current;
      
      if (!stream) {
        const hasAccess = await requestMicrophonePermission();
        if (!hasAccess) return;
        stream = streamRef.current;
      }

      if (!stream) return;

      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setRecordingState('stopped');
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setRecordingTime(0);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const resetRecording = () => {
    setRecordingState('idle');
    setRecordedBlob(null);
    setRecordingTime(0);
    chunksRef.current = [];
  };

  const handleLiveRecordClick = () => {
    setAppState('recording');
    resetRecording();
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setCurrentAnalysisStage(0);
    setAnalysisResults(null);
    setAnalysisError(null);
    setIsAnalyzing(false);
    resetRecording();
    setSelectedFile(null);
  };

  const handleAnalyzeRecording = async () => {
    if (recordedBlob) {
      setAppState('analyzing');
      setCurrentAnalysisStage(0);
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      try {
        const results = await analysisService.analyzeAudio(recordedBlob, {
          onProgress: (stage) => {
            console.log('Analysis progress:', stage);
            // Update stage based on actual progress
            if (stage.includes('Preparing')) setCurrentAnalysisStage(1);
            else if (stage.includes('Uploading')) setCurrentAnalysisStage(2);
            else if (stage.includes('Processing')) setCurrentAnalysisStage(3);
            else if (stage.includes('Analyzing')) setCurrentAnalysisStage(4);
            else if (stage.includes('Finalizing')) setCurrentAnalysisStage(5);
            else if (stage.includes('complete')) setCurrentAnalysisStage(6);
          },
          onRetry: (attempt, error) => {
            console.log(`Retry attempt ${attempt}:`, error);
          },
        });
        
        setAnalysisResults(results);
        setAppState('results');
      } catch (error) {
        console.error('Analysis failed:', error);
        setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
        setAppState('results'); // Show error state in results
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Format recording time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      {/* ANIMATED HEADER BACKGROUND SYSTEM */}
      <div className="header-animation-system">
        {/* Header Background Layers */}
        <div className="header-bg-layers">
          <div className="header-gradient-layer"></div>
          <div className="header-circuit-layer"></div>
          <div className="header-data-flow"></div>
        </div>
        
        {/* Header Particle System */}
        <div className="header-particles">
          <div className="header-particle hp-1"></div>
          <div className="header-particle hp-2"></div>
          <div className="header-particle hp-3"></div>
          <div className="header-particle hp-4"></div>
          <div className="header-particle hp-5"></div>
          <div className="header-particle hp-6"></div>
        </div>
        
        {/* Header Scanning Lines */}
        <div className="header-scanlines">
          <div className="header-scanline hs-1"></div>
          <div className="header-scanline hs-2"></div>
          <div className="header-scanline hs-3"></div>
        </div>
      </div>

      {/* ULTIMATE ANIMATED INTELLIGENCE SYSTEM */}
      <div className="ultimate-intelligence-system">
        {/* Deep Animated Base */}
        <div className="animated-deep-base">
          <div className="base-layer-1"></div>
          <div className="base-layer-2"></div>
          <div className="base-layer-3"></div>
        </div>
        
        {/* Multi-Layer Signal Field */}
        <div className="mega-signal-field">
          {/* Primary Signal Waves */}
          <div className="signal-wave-group primary">
            <div className="signal-wave wave-1"></div>
            <div className="signal-wave wave-2"></div>
            <div className="signal-wave wave-3"></div>
            <div className="signal-wave wave-4"></div>
            <div className="signal-wave wave-5"></div>
            <div className="signal-wave wave-6"></div>
            <div className="signal-wave wave-7"></div>
            <div className="signal-wave wave-8"></div>
          </div>
          
          {/* Secondary Signal Waves */}
          <div className="signal-wave-group secondary">
            <div className="signal-wave wave-9"></div>
            <div className="signal-wave wave-10"></div>
            <div className="signal-wave wave-11"></div>
            <div className="signal-wave wave-12"></div>
            <div className="signal-wave wave-13"></div>
            <div className="signal-wave wave-14"></div>
          </div>
          
          {/* Tertiary Signal Waves */}
          <div className="signal-wave-group tertiary">
            <div className="signal-wave wave-15"></div>
            <div className="signal-wave wave-16"></div>
            <div className="signal-wave wave-17"></div>
            <div className="signal-wave wave-18"></div>
          </div>
        </div>
        
        {/* Advanced Grid System */}
        <div className="advanced-grid-system">
          <div className="grid-layer perspective-grid"></div>
          <div className="grid-layer frequency-grid"></div>
          <div className="grid-layer spectrogram-grid"></div>
          <div className="grid-layer analysis-grid"></div>
        </div>
        
        {/* Volumetric Light System */}
        <div className="volumetric-light-system">
          <div className="light-beam beam-1"></div>
          <div className="light-beam beam-2"></div>
          <div className="light-beam beam-3"></div>
          <div className="light-beam beam-4"></div>
          <div className="light-beam beam-5"></div>
          <div className="light-beam beam-6"></div>
          <div className="light-beam beam-7"></div>
          <div className="light-beam beam-8"></div>
        </div>
        
        {/* Scanning System */}
        <div className="scanning-system">
          <div className="scanner vertical-scanner"></div>
          <div className="scanner horizontal-scanner"></div>
          <div className="scanner diagonal-scanner-1"></div>
          <div className="scanner diagonal-scanner-2"></div>
          <div className="scanner radial-scanner"></div>
        </div>
        
        {/* Particle Field */}
        <div className="particle-field">
          <div className="particle-group group-1">
            <div className="particle p-1"></div>
            <div className="particle p-2"></div>
            <div className="particle p-3"></div>
            <div className="particle p-4"></div>
            <div className="particle p-5"></div>
            <div className="particle p-6"></div>
            <div className="particle p-7"></div>
            <div className="particle p-8"></div>
          </div>
          <div className="particle-group group-2">
            <div className="particle p-9"></div>
            <div className="particle p-10"></div>
            <div className="particle p-11"></div>
            <div className="particle p-12"></div>
            <div className="particle p-13"></div>
            <div className="particle p-14"></div>
            <div className="particle p-15"></div>
            <div className="particle p-16"></div>
          </div>
        </div>
        
        {/* Data Stream Visualization */}
        <div className="data-stream-system">
          <div className="data-stream stream-1"></div>
          <div className="data-stream stream-2"></div>
          <div className="data-stream stream-3"></div>
          <div className="data-stream stream-4"></div>
          <div className="data-stream stream-5"></div>
        </div>
        
        {/* Holographic Overlays */}
        <div className="holographic-overlays">
          <div className="holo-layer layer-1"></div>
          <div className="holo-layer layer-2"></div>
          <div className="holo-layer layer-3"></div>
        </div>
        
        {/* CYBER VOICE ICONS SYSTEM */}
        <div className="cyber-voice-system">
          {/* AI SPEAKING VISUALIZATION */}
          <div className="ai-speaking-system">
            {/* Central AI Voice Core */}
            <div className="ai-voice-core">
              <div className="ai-brain">
                <div className="brain-pulse"></div>
                <div className="neural-network">
                  <div className="neural-node node-1"></div>
                  <div className="neural-node node-2"></div>
                  <div className="neural-node node-3"></div>
                  <div className="neural-node node-4"></div>
                  <div className="neural-node node-5"></div>
                  <div className="neural-connection conn-1"></div>
                  <div className="neural-connection conn-2"></div>
                  <div className="neural-connection conn-3"></div>
                  <div className="neural-connection conn-4"></div>
                </div>
              </div>
              
              {/* Dynamic Voice Waveforms */}
              <div className="voice-waveforms">
                <div className="waveform-container left-waves">
                  <div className="voice-bar bar-1"></div>
                  <div className="voice-bar bar-2"></div>
                  <div className="voice-bar bar-3"></div>
                  <div className="voice-bar bar-4"></div>
                  <div className="voice-bar bar-5"></div>
                  <div className="voice-bar bar-6"></div>
                  <div className="voice-bar bar-7"></div>
                  <div className="voice-bar bar-8"></div>
                </div>
                <div className="waveform-container right-waves">
                  <div className="voice-bar bar-9"></div>
                  <div className="voice-bar bar-10"></div>
                  <div className="voice-bar bar-11"></div>
                  <div className="voice-bar bar-12"></div>
                  <div className="voice-bar bar-13"></div>
                  <div className="voice-bar bar-14"></div>
                  <div className="voice-bar bar-15"></div>
                  <div className="voice-bar bar-16"></div>
                </div>
              </div>
              
              {/* Voice Analysis Rings */}
              <div className="analysis-rings">
                <div className="analysis-ring ring-1">
                  <div className="ring-segment seg-1"></div>
                  <div className="ring-segment seg-2"></div>
                  <div className="ring-segment seg-3"></div>
                  <div className="ring-segment seg-4"></div>
                </div>
                <div className="analysis-ring ring-2">
                  <div className="ring-segment seg-5"></div>
                  <div className="ring-segment seg-6"></div>
                  <div className="ring-segment seg-7"></div>
                  <div className="ring-segment seg-8"></div>
                </div>
                <div className="analysis-ring ring-3">
                  <div className="ring-segment seg-9"></div>
                  <div className="ring-segment seg-10"></div>
                  <div className="ring-segment seg-11"></div>
                  <div className="ring-segment seg-12"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FLOATING VOICE ANALYSIS PANELS */}
          <div className="voice-analysis-panels">
            <div className="analysis-panel panel-1">
              <div className="panel-header">VOICE PATTERN</div>
              <div className="panel-content">
                <div className="analysis-line line-1"></div>
                <div className="analysis-line line-2"></div>
                <div className="analysis-line line-3"></div>
                <div className="analysis-dot dot-1"></div>
                <div className="analysis-dot dot-2"></div>
                <div className="analysis-dot dot-3"></div>
              </div>
            </div>
            
            <div className="analysis-panel panel-2">
              <div className="panel-header">FREQUENCY</div>
              <div className="panel-content">
                <div className="freq-bar f-bar-1"></div>
                <div className="freq-bar f-bar-2"></div>
                <div className="freq-bar f-bar-3"></div>
                <div className="freq-bar f-bar-4"></div>
                <div className="freq-bar f-bar-5"></div>
              </div>
            </div>
            
            <div className="analysis-panel panel-3">
              <div className="panel-header">AUTHENTICITY</div>
              <div className="panel-content">
                <div className="auth-meter">
                  <div className="auth-fill"></div>
                  <div className="auth-indicator"></div>
                </div>
                <div className="auth-text">ANALYZING...</div>
              </div>
            </div>
          </div>
          
          {/* VOICE DATA STREAMS */}
          <div className="voice-data-streams">
            <div className="data-stream-line stream-1">
              <div className="data-packet packet-1"></div>
              <div className="data-packet packet-2"></div>
              <div className="data-packet packet-3"></div>
            </div>
            <div className="data-stream-line stream-2">
              <div className="data-packet packet-4"></div>
              <div className="data-packet packet-5"></div>
              <div className="data-packet packet-6"></div>
            </div>
            <div className="data-stream-line stream-3">
              <div className="data-packet packet-7"></div>
              <div className="data-packet packet-8"></div>
              <div className="data-packet packet-9"></div>
            </div>
          </div>
          
          {/* VOICE SIGNATURE VISUALIZATION */}
          <div className="voice-signature">
            <div className="signature-wave">
              <svg viewBox="0 0 400 100" className="signature-svg">
                <path d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50" className="signature-path path-1"/>
                <path d="M0,50 Q50,80 100,50 T200,50 T300,50 T400,50" className="signature-path path-2"/>
                <path d="M0,50 Q50,35 100,50 T200,50 T300,50 T400,50" className="signature-path path-3"/>
              </svg>
            </div>
            <div className="signature-particles">
              <div className="sig-particle sp-1"></div>
              <div className="sig-particle sp-2"></div>
              <div className="sig-particle sp-3"></div>
              <div className="sig-particle sp-4"></div>
              <div className="sig-particle sp-5"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="app-content">
        {appState === 'landing' && (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              {/* Hero Focus Effects */}
              <div className="hero-focus-system">
                <div className="focus-ring ring-1"></div>
                <div className="focus-ring ring-2"></div>
                <div className="focus-ring ring-3"></div>
                <div className="focus-glow hero-glow"></div>
              </div>
              
              <div className="hero-content">
                <h1 className="hero-headline animated-text">
                  Verify Voice Authenticity. Detect Synthetic Speech.
                </h1>
                <p className="hero-subtext animated-text">
                  A multi-signal intelligence system for detecting AI-generated and manipulated voice content using biometric, temporal, and forensic analysis.
                </p>
              </div>
            </section>

            {/* Input Options Section */}
            <section className="input-options-section">
              <div className="input-options-container">
                {/* File Upload Option */}
                <div className="input-option-panel">
                  <div className="panel-focus-system">
                    <div className="analysis-field field-1"></div>
                    <div className="analysis-field field-2"></div>
                    <div className="analysis-field field-3"></div>
                    <div className="scanning-overlay"></div>
                  </div>
                  
                  <div className="input-panel ultra-animated">
                    <h2 className="panel-title animated-text">Upload Audio File</h2>
                    
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="audio-upload"
                        className="file-input"
                        accept=".mp3,.wav"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="audio-upload" className="file-upload-label animated-upload">
                        <div className="upload-effects">
                          <div className="upload-scanner"></div>
                          <div className="upload-glow"></div>
                        </div>
                        <div className="upload-icon animated-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="upload-text animated-text">
                          {selectedFile ? selectedFile.name : 'Select audio file or drag and drop'}
                        </div>
                      </label>
                    </div>

                    <p className="helper-text animated-text">
                      Accepted formats: MP3, WAV • Maximum duration: 30 seconds
                    </p>

                    <button 
                      className="analyze-button ultra-animated-button" 
                      disabled={!selectedFile}
                      onClick={handleAnalyzeClick}
                    >
                      <div className="button-effects">
                        <div className="button-scanner"></div>
                        <div className="button-glow"></div>
                        <div className="button-particles">
                          <div className="btn-particle bp-1"></div>
                          <div className="btn-particle bp-2"></div>
                          <div className="btn-particle bp-3"></div>
                          <div className="btn-particle bp-4"></div>
                        </div>
                      </div>
                      Analyze Voice
                    </button>
                  </div>
                </div>

                {/* Live Recording Option */}
                <div className="input-option-panel">
                  <div className="panel-focus-system">
                    <div className="analysis-field field-1"></div>
                    <div className="analysis-field field-2"></div>
                    <div className="analysis-field field-3"></div>
                    <div className="scanning-overlay"></div>
                  </div>
                  
                  <div className="input-panel ultra-animated">
                    <h2 className="panel-title animated-text">Live Voice Recording</h2>
                    
                    <div className="live-record-area">
                      <div className="microphone-icon-container">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="microphone-icon">
                          <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                          <path d="M19 10V12C19 16.42 15.42 20 11 20H13C17.42 20 21 16.42 21 12V10H19Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M5 10V12C5 16.42 8.58 20 13 20H11C6.58 20 3 16.42 3 12V10H5Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 20V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="live-record-description animated-text">
                        Record live audio directly from your microphone
                      </p>
                    </div>

                    <p className="helper-text animated-text">
                      Browser microphone access required • Maximum duration: 30 seconds
                    </p>

                    <button 
                      className="live-record-button ultra-animated-button"
                      onClick={handleLiveRecordClick}
                    >
                      <div className="button-effects">
                        <div className="button-scanner"></div>
                        <div className="button-glow"></div>
                        <div className="button-particles">
                          <div className="btn-particle bp-1"></div>
                          <div className="btn-particle bp-2"></div>
                          <div className="btn-particle bp-3"></div>
                          <div className="btn-particle bp-4"></div>
                        </div>
                      </div>
                      Start Live Recording
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {appState === 'recording' && (
          /* LIVE RECORDING PAGE */
          <div className="recording-page">
            {/* Recording Background System */}
            <div className="recording-background-system">
              <div className="recording-grid-overlay"></div>
              <div className="recording-pulse-rings">
                <div className="pulse-ring ring-1"></div>
                <div className="pulse-ring ring-2"></div>
                <div className="pulse-ring ring-3"></div>
              </div>
            </div>

            {/* Recording Chamber */}
            <section className="recording-chamber">
              <div className="recording-header">
                <h1 className="recording-title">LIVE VOICE RECORDING</h1>
                <p className="recording-subtext">
                  {recordingState === 'idle' && 'Ready to capture live audio'}
                  {recordingState === 'recording' && 'Recording in progress...'}
                  {recordingState === 'stopped' && 'Recording completed'}
                </p>
              </div>

              {/* Recording Interface */}
              <div className="recording-interface">
                {/* Microphone Button */}
                <div className="microphone-container">
                  <button
                    className={`microphone-button ${recordingState}`}
                    onClick={recordingState === 'recording' ? stopRecording : startRecording}
                    disabled={recordingState === 'stopped'}
                  >
                    <div className="microphone-effects">
                      <div className="mic-glow"></div>
                      <div className="mic-pulse"></div>
                    </div>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mic-icon">
                      <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                      <path d="M19 10V12C19 16.42 15.42 20 11 20H13C17.42 20 21 16.42 21 12V10H19Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M5 10V12C5 16.42 8.58 20 13 20H11C6.58 20 3 16.42 3 12V10H5Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 20V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Recording Status */}
                <div className="recording-status">
                  <div className="status-indicator">
                    <div className={`status-dot ${recordingState}`}></div>
                    <span className="status-text">
                      {recordingState === 'idle' && 'Ready'}
                      {recordingState === 'recording' && 'Recording'}
                      {recordingState === 'stopped' && 'Complete'}
                    </span>
                  </div>
                  
                  {/* Timer Display */}
                  <div className="timer-display">
                    <span className="timer-text">{formatTime(recordingTime)}</span>
                  </div>
                </div>

                {/* Recording Controls */}
                <div className="recording-controls">
                  {recordingState === 'idle' && (
                    <div className="control-instructions">
                      <p>Click the microphone to start recording</p>
                      {hasPermission === false && (
                        <p className="permission-warning">Microphone access required</p>
                      )}
                    </div>
                  )}
                  
                  {recordingState === 'recording' && (
                    <div className="control-instructions">
                      <p>Recording... Click to stop</p>
                    </div>
                  )}
                  
                  {recordingState === 'stopped' && recordedBlob && (
                    <div className="recording-actions">
                      <button 
                        className="analyze-recording-button ultra-animated-button"
                        onClick={handleAnalyzeRecording}
                      >
                        <div className="button-effects">
                          <div className="button-scanner"></div>
                          <div className="button-glow"></div>
                        </div>
                        Analyze Recording
                      </button>
                      
                      <button 
                        className="reset-recording-button secondary-button"
                        onClick={resetRecording}
                      >
                        Record Again
                      </button>
                    </div>
                  )}
                </div>

                {/* Back Button */}
                <div className="recording-navigation">
                  <button 
                    className="back-button secondary-button"
                    onClick={handleBackToLanding}
                  >
                    ← Back to Options
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {appState === 'analyzing' && (
          /* PAGE 2: ANALYSIS IN PROGRESS */
          <div className="analysis-page">
            {/* Analysis Background System */}
            <div className="analysis-background-system">
              <div className="analysis-grid-overlay"></div>
              <div className="analysis-scanlines">
                <div className="analysis-scanline asl-1"></div>
                <div className="analysis-scanline asl-2"></div>
                <div className="analysis-scanline asl-3"></div>
                <div className="analysis-scanline asl-4"></div>
              </div>
              <div className="analysis-data-streams">
                <div className="analysis-stream as-1"></div>
                <div className="analysis-stream as-2"></div>
                <div className="analysis-stream as-3"></div>
              </div>
            </div>

            {/* Analysis Chamber */}
            <section className="analysis-chamber">
              <div className="chamber-header">
                <h1 className="analysis-title">VOICE ANALYSIS IN PROGRESS</h1>
                <p className="analysis-subtext">Extracting biometric, temporal, and forensic signals</p>
              </div>

              {/* Analysis Pipeline */}
              <div className="analysis-pipeline">
                <div className={`pipeline-stage stage-1 ${currentAnalysisStage >= 1 ? 'stage-active' : ''}`}>
                  <div className="stage-indicator"></div>
                  <div className="stage-label">SIGNAL EXTRACTION</div>
                  <div className="stage-description">
                    {currentAnalysisStage >= 1 ? 'Isolating voice patterns' : 'Pending...'}
                  </div>
                </div>

                <div className="pipeline-connector connector-1"></div>

                <div className={`pipeline-stage stage-2 ${currentAnalysisStage >= 2 ? 'stage-active' : ''}`}>
                  <div className="stage-indicator"></div>
                  <div className="stage-label">BIOMETRIC ANALYSIS</div>
                  <div className="stage-description">
                    {currentAnalysisStage >= 2 ? 'Analyzing vocal characteristics' : 'Pending...'}
                  </div>
                </div>

                <div className="pipeline-connector connector-2"></div>

                <div className={`pipeline-stage stage-3 ${currentAnalysisStage >= 3 ? 'stage-active' : ''}`}>
                  <div className="stage-indicator"></div>
                  <div className="stage-label">TEMPORAL MAPPING</div>
                  <div className="stage-description">
                    {currentAnalysisStage >= 3 ? 'Processing time-domain features' : 'Pending...'}
                  </div>
                </div>

                <div className="pipeline-connector connector-3"></div>

                <div className={`pipeline-stage stage-4 ${currentAnalysisStage >= 4 ? 'stage-active' : ''}`}>
                  <div className="stage-indicator"></div>
                  <div className="stage-label">FREQUENCY DECOMPOSITION</div>
                  <div className="stage-description">
                    {currentAnalysisStage >= 4 ? 'Spectral analysis in progress' : 'Pending...'}
                  </div>
                </div>

                <div className="pipeline-connector connector-4"></div>

                <div className={`pipeline-stage stage-5 ${currentAnalysisStage >= 5 ? 'stage-active' : ''}`}>
                  <div className="stage-indicator"></div>
                  <div className="stage-label">FORENSIC VALIDATION</div>
                  <div className="stage-description">
                    {currentAnalysisStage >= 5 ? 'Cross-referencing signatures' : 'Pending...'}
                  </div>
                </div>

                <div className="pipeline-connector connector-5"></div>

                <div className={`pipeline-stage stage-6 ${currentAnalysisStage >= 6 ? 'stage-active' : ''}`}>
                  <div className="stage-indicator"></div>
                  <div className="stage-label">SYNTHESIS DETECTION</div>
                  <div className="stage-description">
                    {currentAnalysisStage >= 6 ? 'AI generation assessment complete' : 'Pending...'}
                  </div>
                </div>
              </div>

              {/* System Message */}
              <div className="analysis-message">
                <div className="analysis-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(currentAnalysisStage / 6) * 100}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    Stage {currentAnalysisStage} of 6 • {Math.round((currentAnalysisStage / 6) * 100)}% Complete
                  </div>
                </div>
                <p>
                  {currentAnalysisStage === 0 && 'Initializing analysis systems...'}
                  {currentAnalysisStage === 1 && 'Extracting voice patterns and signal characteristics...'}
                  {currentAnalysisStage === 2 && 'Analyzing biometric markers and vocal signatures...'}
                  {currentAnalysisStage === 3 && 'Processing temporal features and timing patterns...'}
                  {currentAnalysisStage === 4 && 'Performing spectral decomposition and frequency analysis...'}
                  {currentAnalysisStage === 5 && 'Cross-referencing forensic databases and signatures...'}
                  {currentAnalysisStage === 6 && 'Finalizing synthesis detection and generating report...'}
                </p>
              </div>
            </section>
          </div>
        )}

        {appState === 'results' && (
          /* PAGE 3: ANALYSIS RESULTS */
          <div className="results-page">
            {/* Results Background System */}
            <div className="results-background-system">
              <div className="results-grid-overlay"></div>
              <div className="results-ambient-glow"></div>
            </div>

            {/* Results Chamber */}
            <section className="results-chamber">
              <div className="results-header">
                <h1 className="results-title">
                  {analysisError ? 'ANALYSIS FAILED' : 'ANALYSIS COMPLETE'}
                </h1>
                <p className="results-subtext">
                  {analysisError ? 'An error occurred during analysis' : 'Voice authenticity assessment results'}
                </p>
              </div>

              {/* Result Content */}
              <div className="results-content">
                {analysisError ? (
                  /* Error State */
                  <div className="error-display">
                    <div className="error-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M15 9l-6 6" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 9l6 6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="error-message">
                      <h3>Analysis Error</h3>
                      <p>{analysisError}</p>
                    </div>
                    <div className="error-actions">
                      <button 
                        className="retry-button"
                        onClick={() => {
                          if (selectedFile) {
                            handleAnalyzeClick();
                          } else if (recordedBlob) {
                            handleAnalyzeRecording();
                          }
                        }}
                      >
                        Try Again
                      </button>
                      <button 
                        className="new-analysis-button secondary"
                        onClick={handleBackToLanding}
                      >
                        New Analysis
                      </button>
                    </div>
                  </div>
                ) : analysisResults ? (
                  /* Success State */
                  <>
                    {/* ResultDial component removed - using TRACE frontend instead */}
                    <div className="analysis-complete">
                      <h2>Analysis Complete</h2>
                      <p>Decision: {analysisResults.decision}</p>
                      <p>Confidence: {(analysisResults.scores.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div className="results-actions">
                      <button 
                        className="new-analysis-button"
                        onClick={handleBackToLanding}
                      >
                        New Analysis
                      </button>
                    </div>
                  </>
                ) : (
                  /* Loading State (shouldn't happen but fallback) */
                  <div className="loading-display">
                    <p>Processing results...</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;