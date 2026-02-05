from pydantic import BaseModel, Field
from typing import Literal


class SignalContribution(BaseModel):
    confidence: float = Field(..., ge=0.0, le=1.0)
    weight: float = Field(..., ge=0.0, le=1.0)


class ScoreBlock(BaseModel):
    authenticity_score: float = Field(..., ge=0.0, le=1.0)
    trust_index: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)


class ProvenanceBlock(BaseModel):
    human_probability: float = Field(..., ge=0.0, le=1.0)
    synthetic_probability: float = Field(..., ge=0.0, le=1.0)


class SignalsBlock(BaseModel):
    aasist: SignalContribution
    hfi: SignalContribution
    tns: SignalContribution


class VoiceAnalysisResponse(BaseModel):
    decision: Literal["AUTHENTIC", "SYNTHETIC", "UNCERTAIN"]
    scores: ScoreBlock
    provenance: ProvenanceBlock
    signals: SignalsBlock
    explanation: str
