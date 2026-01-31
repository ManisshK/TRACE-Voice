import io
import numpy as np
import soundfile as sf
from typing import Optional, Tuple

def load_audio_bytes(audio_bytes: bytes) -> Tuple[Optional[np.ndarray], Optional[int], Optional[str]]:
    """
    STEP 2: Decode audio bytes into waveform + sample rate.

    Returns:
        waveform (np.float32), sample_rate (int), error_message (str)
    """
    try:
        with sf.SoundFile(io.BytesIO(audio_bytes)) as f:
            waveform = f.read(dtype="float32")
            sample_rate = f.samplerate
    except Exception:
        return None, None, "Unsupported or corrupted audio format"

    if waveform.ndim > 2:
        return None, None, "Unsupported multi-channel audio"

    return waveform, sample_rate, None
