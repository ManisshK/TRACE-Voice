from typing import Dict, List


def evaluate_fusion(
    aasist_confidence: float,
    hfi_confidence: float,
    tns_confidence: float
) -> Dict:
    """
    Explainable decision fusion engine (locked v1)
    All inputs must be in range [0, 1]
    """

    # -------------------------------
    # Fixed, explainable weights
    # -------------------------------
    weights = {
        "aasist": 0.40,
        "hfi": 0.35,
        "tns": 0.25
    }

    # -------------------------------
    # Base authenticity score
    # -------------------------------
    authenticity_score = (
        weights["aasist"] * aasist_confidence +
        weights["hfi"] * hfi_confidence +
        weights["tns"] * tns_confidence
    )

    trust_index = authenticity_score
    explanation: List[str] = []

    scores = [aasist_confidence, hfi_confidence, tns_confidence]
    weak_signals = sum(score < 0.4 for score in scores)
    spread = max(scores) - min(scores)

    if weak_signals >= 1:
        trust_index -= 0.15
        explanation.append(
            "One or more analysis modules report weak human-likeness indicators."
        )

    if weak_signals >= 2:
        trust_index -= 0.20
        explanation.append(
            "Multiple independent signals indicate potential synthetic characteristics."
        )

    if spread > 0.4:
        trust_index -= 0.10
        explanation.append(
            "High disagreement observed between analysis modules."
        )

    trust_index = max(0.0, min(1.0, trust_index))

    # -------------------------------
    # Final decision
    # -------------------------------
    if trust_index >= 0.75:
        decision = "AUTHENTIC"
        explanation.append(
            "Aggregated evidence strongly supports natural human speech."
        )
    elif trust_index <= 0.45:
        decision = "SYNTHETIC"
        explanation.append(
            "Aggregated evidence is consistent with synthetic speech generation."
        )
    else:
        decision = "UNCERTAIN"
        explanation.append(
            "Evidence is inconclusive and requires further analysis."
        )

    confidence = abs(trust_index - 0.6) * 1.6
    confidence = max(0.0, min(1.0, confidence))

    return {
        "decision": decision,
        "authenticity_score": round(authenticity_score, 3),
        "trust_index": round(trust_index, 3),
        "confidence": round(confidence, 3),
        "weights": weights,
        "explanation": explanation
    }
