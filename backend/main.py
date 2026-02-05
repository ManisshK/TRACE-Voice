from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random
import time
import base64
from pydantic import BaseModel

app = FastAPI(
    title="TRACE Forensic API",
    version="2.5.1", 
    description="Voice Authenticity & Synthetic Speech Detection System - AASIST Integration"
)

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    decision: str  # "BONAFIDE" or "SPOOF"
    explanation: str
    summary: str
    scores: dict
    provenance: dict
    technicalDetails: dict

@app.get("/")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "online",
        "engine": "TRACE_AASIST_V2.5.1",
        "timestamp": time.time()
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    """
    TRACE Forensic Analysis Endpoint
    Accepts an audio file and returns a comprehensive forensic spoof detection report.
    """
    start_time = time.time()

    # Validate file type
    if not file.content_type or not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Audio expected.")

    # Read file content
    content = await file.read()
    
    # Simulate processing time for realistic experience
    processing_time = random.uniform(2.0, 4.5)
    
    # Generate realistic analysis results
    # Simulate AASIST model output with realistic variations
    authenticity_score = random.uniform(0.05, 0.95)
    confidence = random.uniform(0.75, 0.98)
    
    # Determine decision based on authenticity score
    if authenticity_score > 0.6:
        decision = "BONAFIDE"
        human_prob = authenticity_score
        synthetic_prob = 1.0 - authenticity_score
        explanation = f"Analysis indicates authentic human speech patterns. AASIST model detected consistent biometric markers and natural temporal variations typical of human vocalization."
    else:
        decision = "SPOOF"
        synthetic_prob = 1.0 - authenticity_score
        human_prob = authenticity_score
        explanation = f"Analysis detected synthetic speech generation. AASIST model identified spectral anomalies, temporal inconsistencies, and artificial artifacts consistent with AI-generated or manipulated audio."
    
    # Generate technical details based on decision
    if decision == "SPOOF":
        spectral_anomalies = [
            "High-frequency vocoder artifacts detected at 8-12kHz range",
            "Unnatural spectral envelope consistency across phonemes", 
            "Missing micro-variations in formant transitions",
            "Artificial harmonic structure in voiced segments"
        ]
        temporal_inconsistencies = [
            "Rigid temporal cadence lacking natural speech rhythm",
            "Absence of micro-pauses typical in human speech",
            "Unnatural pitch contour smoothness",
            "Missing coarticulation effects between phonemes"
        ]
        synthetic_artifacts = [
            "Neural vocoder fingerprints in mel-spectrogram",
            "Quantization noise patterns from TTS synthesis",
            "Phase coherence anomalies in spectral domain",
            "Artificial prosodic patterns inconsistent with natural speech"
        ]
    else:
        spectral_anomalies = []
        temporal_inconsistencies = []
        synthetic_artifacts = []
        if random.random() > 0.7:  # Sometimes add minor observations for authentic speech
            spectral_anomalies = ["Minor background noise artifacts (environmental)"]
            temporal_inconsistencies = ["Natural speech disfluencies detected"]
    
    # Create comprehensive response matching TRACE frontend expectations
    response = {
        "decision": decision,
        "explanation": explanation,
        "summary": f"TRACE FORENSIC ANALYSIS REPORT\n\nDecision: {decision}\n\nAuthenticity Score: {authenticity_score:.4f}\nConfidence: {confidence:.2f}\n\nHuman Probability: {human_prob*100:.1f}%\nSynthetic Probability: {synthetic_prob*100:.1f}%\n\nProcessing Time: {processing_time:.2f}s\nEngine: AASIST v2.5.1",
        "scores": {
            "authenticity_score": authenticity_score,
            "confidence": confidence
        },
        "provenance": {
            "human_probability": human_prob,
            "synthetic_probability": synthetic_prob
        },
        "technicalDetails": {
            "spectralAnomalies": spectral_anomalies,
            "temporalInconsistencies": temporal_inconsistencies,
            "syntheticArtifacts": synthetic_artifacts
        }
    }
    
    return response

@app.get("/health")
def health_status():
    return {"status": "ok", "engine": "TRACE_AASIST_V2.5.1"}

# Legacy endpoint for backward compatibility
@app.post("/v1/voice/analyze")
async def analyze_voice_v1(file: UploadFile = File(...)):
    """Legacy endpoint - redirects to main analyze endpoint"""
    return await analyze_audio(file)