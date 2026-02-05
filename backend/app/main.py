from fastapi import FastAPI, Header, HTTPException
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
    x_api_key: str = Header(..., alias="x-api-key")
):
    # 🔐 API key verification
    if x_api_key != get_api_key():
        raise HTTPException(status_code=401, detail="Invalid API key")

    # ------------------------------------------------
    # TEMPORARY mocked model outputs (Phase-2 demo)
    # ------------------------------------------------
    aasist_confidence = 0.90
    hfi_confidence = 0.87
    tns_confidence = 0.85

    fusion_result = evaluate_fusion(
        aasist_confidence=aasist_confidence,
        hfi_confidence=hfi_confidence,
        tns_confidence=tns_confidence
    )

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
                "confidence": aasist_confidence,
                "weight": 0.40
            },
            "hfi": {
                "confidence": hfi_confidence,
                "weight": 0.35
            },
            "tns": {
                "confidence": tns_confidence,
                "weight": 0.25
            }
        },
        "explanation": " ".join(fusion_result["explanation"])
    }
