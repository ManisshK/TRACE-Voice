import numpy as np
import librosa
from typing import Tuple

TARGET_SAMPLE_RATE = 16000

def normalize_audio(
    waveform: np.ndarray,
    sample_rate: int
) -> Tuple[np.ndarray, int]:
    """
    STEP 3:
    - Convert to mono if needed
    - Resample to 16 kHz

    Returns:
        normalized_waveform (np.float32)
        normalized_sample_rate (int)
    """

    # 1. Convert to mono
    if waveform.ndim == 2:
        # shape: (samples, channels) or (channels, samples)
        if waveform.shape[0] < waveform.shape[1]:
            waveform = np.mean(waveform, axis=0)
        else:
            waveform = np.mean(waveform, axis=1)

    # 2. Ensure float32
    waveform = waveform.astype(np.float32)

    # 3. Resample if needed
    if sample_rate != TARGET_SAMPLE_RATE:
        waveform = librosa.resample(
            waveform,
            orig_sr=sample_rate,
            target_sr=TARGET_SAMPLE_RATE
        )

    return waveform, TARGET_SAMPLE_RATE
