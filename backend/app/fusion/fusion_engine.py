from fusion_constants import *

def evaluate_speech_authenticity(human_likelihood: float,
                                synthetic_likelihood: float,
                                hfi: float,
                                tns: float,
                                diffusion_probability: float,
                                forensic_indicator_count: int,
                                signal_conflict: bool) -> dict:
    
    sas = (0.45 * human_likelihood * 100) + (0.35 * hfi) + (0.20 * tns)
    sas = max(SCORE_MIN, min(SCORE_MAX, sas))
    
    tis = sas
    
    if synthetic_likelihood >= SYNTHETIC_LIKELIHOOD_HIGH:
        tis -= PENALTY_HIGH_SYNTHETIC_LIKELIHOOD
    
    if diffusion_probability >= 0.5:
        tis -= PENALTY_DIFFUSION_SIGNATURE
    
    if forensic_indicator_count >= 2:
        tis -= PENALTY_MULTIPLE_FORENSIC_FLAGS
    
    if signal_conflict is True:
        tis -= PENALTY_SIGNAL_CONFLICT
    
    tis = max(SCORE_MIN, min(SCORE_MAX, tis))
    
    if tis >= TRUST_THRESHOLD_HUMAN and synthetic_likelihood < SYNTHETIC_LIKELIHOOD_LOW:
        verdict = "Human Speech Verified"
    elif tis <= TRUST_THRESHOLD_SYNTHETIC or synthetic_likelihood >= SYNTHETIC_LIKELIHOOD_HIGH:
        verdict = "Synthetic Speech Detected"
    else:
        verdict = "Inconclusive — Further Analysis Required"
    
    if verdict == "Synthetic Speech Detected":
        decision_confidence = min(CONFIDENCE_MAX_SYNTHETIC, CONFIDENCE_BASE_SYNTHETIC + synthetic_likelihood * 40)
    elif verdict == "Human Speech Verified":
        decision_confidence = min(CONFIDENCE_MAX_HUMAN, CONFIDENCE_BASE_HUMAN + tis * 0.5)
    else:
        decision_confidence = 45 + abs(tis - 50) * 0.5
    
    return {
        "speech_authenticity_score": sas,
        "trust_integrity_score": tis,
        "verdict": verdict,
        "decision_confidence": decision_confidence
    }