import base64
from typing import Optional, Tuple

def decode_base64_audio(audio_base64: str) -> Tuple[Optional[bytes], Optional[str]]:
    """
    Decode base64-encoded audio safely.

    Returns:
        (audio_bytes, error_message)
    """

    if audio_base64 is None or not isinstance(audio_base64, str):
        return None, "Audio input must be a base64 string"

    audio_base64 = audio_base64.strip()
    if not audio_base64:
        return None, "Empty audio input"

    try:
        audio_bytes = base64.b64decode(audio_base64, validate=True)
    except Exception:
        return None, "Invalid base64 encoding"

    if len(audio_bytes) < 1024:
        return None, "Decoded audio data too small to be valid"

    return audio_bytes, None
