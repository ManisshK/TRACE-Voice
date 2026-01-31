from typing import Dict, Any

from sai_audio.decode import decode_base64_audio
from sai_audio.load_audio import load_audio_bytes
from sai_audio.normalize import normalize_audio
from sai_audio.validate import trim_and_validate


def process_audio_base64(audio_base64: str) -> Dict[str, Any]:
    """
    Full Sai audio preprocessing pipeline.

    Returns a dict safe for backend consumption.
    """

    # STEP 1: Base64 decode
    audio_bytes, err = decode_base64_audio(audio_base64)
    if err is not None or audio_bytes is None:
        return {
            "is_valid": False,
            "error": err,
            "warnings": []
        }

    # STEP 2: Load audio bytes
    waveform, sample_rate, err = load_audio_bytes(audio_bytes)
    if err is not None or waveform is None or sample_rate is None:
        return {
            "is_valid": False,
            "error": err,
            "warnings": []
        }

    # STEP 3: Normalize (mono + 16kHz)
    waveform, sample_rate = normalize_audio(waveform, sample_rate)

    # STEP 4: Trim silence + duration checks
    waveform, duration_sec, is_valid, warnings = trim_and_validate(
        waveform, sample_rate
    )

    if not is_valid:
        return {
            "is_valid": False,
            "error": "Invalid audio after preprocessing",
            "warnings": warnings
        }

    return {
        "is_valid": True,
        "waveform": waveform,
        "sample_rate": sample_rate,
        "duration_sec": duration_sec,
        "warnings": warnings
    }
