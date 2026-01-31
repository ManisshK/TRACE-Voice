import numpy as np
import librosa
from typing import Dict, List, Tuple

MIN_DURATION_SEC = 1.0
WARN_DURATION_SEC = 2.0
MAX_DURATION_SEC = 10.0

def trim_and_validate(
    waveform: np.ndarray,
    sample_rate: int
) -> Tuple[np.ndarray, float, bool, List[str]]:
    """
    STEP 4:
    - Trim leading/trailing silence
    - Enforce duration rules

    Returns:
        waveform
        duration_sec
        is_valid
        warnings
    """

    warnings: List[str] = []

    # 1. Trim silence (conservative)
    trimmed, _ = librosa.effects.trim(
        waveform,
        top_db=25
    )

    if trimmed.size == 0:
        return waveform, 0.0, False, ["silence_only_audio"]

    duration_sec = len(trimmed) / sample_rate

    # 2. Duration checks
    if duration_sec < MIN_DURATION_SEC:
        return trimmed, duration_sec, False, ["audio_too_short"]

    if duration_sec < WARN_DURATION_SEC:
        warnings.append("short_audio_low_confidence")

    # 3. Cap max duration
    max_samples = int(MAX_DURATION_SEC * sample_rate)
    if len(trimmed) > max_samples:
        trimmed = trimmed[:max_samples]
        warnings.append("audio_trimmed_to_max_duration")
        duration_sec = MAX_DURATION_SEC

    return trimmed, duration_sec, True, warnings
