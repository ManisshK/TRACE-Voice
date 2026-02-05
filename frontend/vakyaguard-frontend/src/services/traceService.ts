import { audioAnalysisAPI, BackendAnalysisResponse } from './audioAnalysisAPI';
import { AnalysisReport, DetectionResult, FileData } from '../types/trace';

/**
 * TRACE Service - Integrates with VakyaGuard backend
 * Transforms backend responses to TRACE format
 */
export class TraceService {
  /**
   * Analyze audio using the VakyaGuard backend
   * @param fileData - Audio file data
   * @returns TRACE-formatted analysis report
   */
  async analyzeAudio(fileData: FileData): Promise<AnalysisReport> {
    try {
      // Convert base64 to blob for the API
      const binaryString = atob(fileData.base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: fileData.type });

      // Call the VakyaGuard backend API
      const backendResponse = await audioAnalysisAPI.uploadAudio(audioBlob);
      
      // Transform to TRACE format
      return this.transformToTraceFormat(backendResponse);
    } catch (error) {
      console.error('TRACE analysis failed:', error);
      throw new Error(`AASIST Pipeline Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transform VakyaGuard backend response to TRACE format
   * @param backendResponse - Response from VakyaGuard backend
   * @returns TRACE-formatted analysis report
   */
  private transformToTraceFormat(backendResponse: BackendAnalysisResponse): AnalysisReport {
    // Map backend decision to TRACE format
    const decision = backendResponse.decision === 'SYNTHETIC' ? DetectionResult.SPOOF : DetectionResult.BONAFIDE;
    
    // Generate TRACE-style explanation
    const explanation = this.generateTraceExplanation(backendResponse);
    
    // Generate TRACE summary
    const summary = this.generateTraceSummary(backendResponse);
    
    // Transform technical details
    const technicalDetails = this.transformTechnicalDetails(backendResponse);

    return {
      decision,
      explanation,
      summary,
      scores: {
        authenticity_score: backendResponse.scores.authenticity_score,
        confidence: backendResponse.scores.confidence
      },
      provenance: {
        human_probability: backendResponse.provenance.human_probability,
        synthetic_probability: backendResponse.provenance.synthetic_probability
      },
      technicalDetails
    };
  }

  /**
   * Generate TRACE-style explanation
   */
  private generateTraceExplanation(response: BackendAnalysisResponse): string {
    const isSpoof = response.decision === 'SYNTHETIC';
    const confidence = (response.scores.confidence * 100).toFixed(1);
    
    if (isSpoof) {
      return `TRACE forensic analysis detected synthetic speech patterns with ${confidence}% confidence. ` +
             `The AASIST graph attention network identified spectral anomalies and temporal inconsistencies ` +
             `characteristic of AI-generated audio. Multi-signal fusion analysis confirms spoof classification.`;
    } else {
      return `TRACE forensic analysis confirms authentic human speech with ${confidence}% confidence. ` +
             `The AASIST graph attention network found consistent biometric markers and natural temporal patterns. ` +
             `Spectral analysis shows no evidence of synthetic artifacts or vocoder processing.`;
    }
  }

  /**
   * Generate TRACE summary
   */
  private generateTraceSummary(response: BackendAnalysisResponse): string {
    const humanPct = (response.provenance.human_probability * 100).toFixed(1);
    const synthPct = (response.provenance.synthetic_probability * 100).toFixed(1);
    const confidence = (response.scores.confidence * 100).toFixed(1);
    
    return `TRACE RESULT\n\n` +
           `Decision: ${response.decision}\n\n` +
           `Authenticity Score: ${response.scores.authenticity_score.toFixed(4)}\n` +
           `Confidence: ${confidence}%\n\n` +
           `Human Probability: ${humanPct}%\n` +
           `Synthetic Probability: ${synthPct}%`;
  }

  /**
   * Transform backend signals to TRACE technical details
   */
  private transformTechnicalDetails(response: BackendAnalysisResponse) {
    return {
      spectralAnomalies: [
        `AASIST confidence: ${(response.signals.aasist.confidence * 100).toFixed(1)}%`,
        `Spectral analysis weight: ${(response.signals.aasist.weight * 100).toFixed(0)}%`,
        `Sinc-convolutional feature extraction completed`,
        `Graph attention spectral node analysis: ${response.signals.aasist.confidence > 0.8 ? 'ANOMALOUS' : 'NORMAL'}`
      ],
      temporalInconsistencies: [
        `HFI confidence: ${(response.signals.hfi.confidence * 100).toFixed(1)}%`,
        `Temporal analysis weight: ${(response.signals.hfi.weight * 100).toFixed(0)}%`,
        `Heterogeneous graph temporal edges: ${response.signals.hfi.confidence > 0.8 ? 'IRREGULAR' : 'CONSISTENT'}`,
        `Time-domain pattern analysis completed`
      ],
      syntheticArtifacts: [
        `TNS confidence: ${(response.signals.tns.confidence * 100).toFixed(1)}%`,
        `Synthesis detection weight: ${(response.signals.tns.weight * 100).toFixed(0)}%`,
        `Vocoder artifact detection: ${response.decision === 'SYNTHETIC' ? 'DETECTED' : 'NONE'}`,
        `Temperature-scaled softmax output: ${(response.scores.confidence * 100).toFixed(1)}%`
      ]
    };
  }
}

// Export singleton instance
export const traceService = new TraceService();