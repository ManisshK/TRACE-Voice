// Frontend API client for VakyaGuard backend (REAL integration)
// Backend API Response Interface (matches backend schema)
export interface BackendAnalysisResponse {
  decision: 'AUTHENTIC' | 'SPOOF';

  scores: {
    authenticity_score: number;
    trust_index: number;
    confidence: number;
  };

  provenance: {
    human_probability: number;
    synthetic_probability: number;
  };

  signals: {
    aasist: {
      confidence: number;
      weight: number;
    };
    hfi: {
      confidence: number;
      weight: number;
    };
    tns: {
      confidence: number;
      weight: number;
    };
  };

  explanation: string;
}
