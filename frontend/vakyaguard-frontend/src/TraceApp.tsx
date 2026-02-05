import React, { useState, useEffect } from 'react';
import { Layout } from './components/trace/Layout';
import { Uploader } from './components/trace/Uploader';
import { AudioRecorder } from './components/trace/AudioRecorder';
import { ResultView } from './components/trace/ResultView';
import { ProcessingView } from './components/trace/ProcessingView';
import { EducationalPanel } from './components/trace/EducationalPanel';
import { CodeViewer } from './components/trace/CodeViewer';
import { audioAnalysisAPI } from './services/audioAnalysisAPI';
import { AnalysisReport, DetectionResult, FileData } from './types/trace';
import { Zap, ShieldAlert, Crosshair } from 'lucide-react';

const TraceApp: React.FC = () => {
  // 🔧 removed unused setter
  const [activeTab] = useState<'upload' | 'record' | 'code'>('upload');

  const [fileData, setFileData] = useState<FileData | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleFileSelect = (file: FileData | null) => {
    setFileData(file);
    setReport(null);
    setError(null);
  };

  const handleReset = () => {
    setFileData(null);
    setReport(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const handleAnalyze = async () => {
    if (!fileData) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const binary = atob(fileData.base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const audioBlob = new Blob([bytes], { type: fileData.type });
      const backendResponse = await audioAnalysisAPI.uploadAudio(audioBlob);

      const traceReport: AnalysisReport = {
        decision:
          backendResponse.decision === 'SPOOF'
            ? DetectionResult.SPOOF
            : DetectionResult.BONAFIDE,

        explanation: backendResponse.explanation,

        // ✅ REQUIRED FIELD – FIXED
        summary: `
Decision: ${backendResponse.decision}
Authenticity Score: ${backendResponse.scores.authenticity_score.toFixed(3)}
Confidence: ${(backendResponse.scores.confidence * 100).toFixed(1)}%
`.trim(),

        scores: {
          authenticity_score: backendResponse.scores.authenticity_score,
          confidence: backendResponse.scores.confidence
        },

        provenance: {
          human_probability: backendResponse.provenance.human_probability,
          synthetic_probability: backendResponse.provenance.synthetic_probability
        },

        technicalDetails: {
          spectralAnomalies: [
            `AASIST confidence: ${(backendResponse.signals.aasist.confidence * 100).toFixed(1)}%`
          ],
          temporalInconsistencies: [
            `HFI confidence: ${(backendResponse.signals.hfi.confidence * 100).toFixed(1)}%`
          ],
          syntheticArtifacts: [
            `TNS confidence: ${(backendResponse.signals.tns.confidence * 100).toFixed(1)}%`
          ]
        }
      };

      setTimeout(() => {
        setReport(traceReport);
        setIsAnalyzing(false);
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Forensic pipeline error.');
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      {/* Mouse Reticle */}
      <div
        className="fixed w-64 h-64 border border-white/10 rounded-full pointer-events-none z-50 hidden md:block"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Crosshair className="absolute inset-0 m-auto text-cyan-400/40" />
      </div>

      <section id="analysis-lab" className="p-10">
        {!isAnalyzing && !report && (
          <>
            {activeTab === 'upload' && (
              <Uploader
                onFileSelect={handleFileSelect}
                isLoading={isAnalyzing}
              />
            )}

            {activeTab === 'record' && (
              <AudioRecorder
                onRecordingComplete={handleFileSelect}
                isLoading={isAnalyzing}
              />
            )}

            {activeTab === 'code' && <CodeViewer />}

            {fileData && activeTab !== 'code' && (
              <button
                onClick={handleAnalyze}
                className="mt-12 px-12 py-6 bg-orange-600 text-black font-black rounded-xl"
              >
                <Zap className="inline mr-4" />
                DEPLOY TRACE PROBE
              </button>
            )}
          </>
        )}

        {isAnalyzing && <ProcessingView />}

        {report && <ResultView report={report} onReset={handleReset} />}

        {error && (
          <div className="mt-8 text-red-500 flex items-center gap-4">
            <ShieldAlert />
            {error}
          </div>
        )}
      </section>

      <EducationalPanel />
    </Layout>
  );
};

export default TraceApp;
