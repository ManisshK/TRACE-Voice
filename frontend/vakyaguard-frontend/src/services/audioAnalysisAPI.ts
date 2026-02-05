// Frontend API client for VakyaGuard backend (REAL integration)

export interface BackendAnalysisResponse {
  decision: "AUTHENTIC" | "SPOOF";
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

// === CONFIG ===
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://vakyaguard-backend.onrender.com";

const API_KEY = import.meta.env.VITE_VAKYAGUARD_API_KEY;

export class AudioAnalysisAPI {
  async uploadAudio(audioData: Blob | File): Promise<BackendAnalysisResponse> {
    if (!API_KEY) {
      throw new Error("Missing API key (VITE_VAKYAGUARD_API_KEY)");
    }

    const formData = new FormData();

    if (audioData instanceof File) {
      formData.append("file", audioData);
    } else {
      const file = new File([audioData], "recording.webm", {
        type: audioData.type || "audio/webm",
      });
      formData.append("file", file);
    }

    const response = await fetch(
      `${BACKEND_URL}/v1/voice/analyze`,
      {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Backend error ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    console.log("✅ REAL backend response:", data);
    return data;
  }
}

// Singleton
export const audioAnalysisAPI = new AudioAnalysisAPI();
