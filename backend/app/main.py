from fastapi import FastAPI, Header, HTTPException, UploadFile, File
from app.fusion.fusion_engine import evaluate_fusion
from app.schemas.voice_response import VoiceAnalysisResponse
from app.config import get_api_key

app = FastAPI(
    title="VakyaGuard API",
    version="1.0.0",
    description="Voice Authenticity & Provenance Intelligence System"
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/v1/voice/analyze", response_model=VoiceAnalysisResponse)
def analyze_voice(
    file: UploadFile = File(...),
    x_api_key: str = Header(..., alias="x-api-key")
):
    # 🔐 API key verification
    if x_api_key != get_api_key():
        raise HTTPException(status_code=401, detail="Invalid API key")

    # ------------------------------------------------
    # TEMPORARY dynamic analysis (mock → audio-aware)
    # ------------------------------------------------

    # Read audio bytes
    audio_bytes = file.file.read()
    audio_size = len(audio_bytes)

    # Generate dynamic confidence values based on audio
    aasist_confidence = min(0.99, max(0.05, (audio_size % 100) / 100))
    hfi_confidence = min(0.95, max(0.05, ((audio_size // 2) % 100) / 100))
    tns_confidence = min(0.90, max(0.05, ((audio_size // 3) % 100) / 100))

    # Fuse results
    fusion_result = evaluate_fusion(
        aasist_confidence=aasist_confidence,
        hfi_confidence=hfi_confidence,
        tns_confidence=tns_confidence
    )

    # Return response
    return {
        "decision": fusion_result["decision"],
        "scores": {
            "authenticity_score": fusion_result["authenticity_score"],
            "trust_index": fusion_result["trust_index"],
            "confidence": fusion_result["confidence"]
        },
        "provenance": {
            "human_probability": fusion_result["trust_index"],
            "synthetic_probability": round(1 - fusion_result["trust_index"], 3)
        },
        "signals": {
            "aasist": {
                "confidence": round(aasist_confidence, 3),
                "weight": 0.40
            },
            "hfi": {
                "confidence": round(hfi_confidence, 3),
                "weight": 0.35
            },
            "tns": {
                "confidence": round(tns_confidence, 3),
                "weight": 0.25
            }
        },
        "explanation": " ".join(fusion_result["explanation"])
    }
