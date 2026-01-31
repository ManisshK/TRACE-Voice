import base64
from sai_audio.decode import decode_base64_audio
from sai_audio.load_audio import load_audio_bytes

with open("sample.wav", "rb") as f:
    audio_b64 = base64.b64encode(f.read()).decode()

audio_bytes, err = decode_base64_audio(audio_b64)
if err is not None or audio_bytes is None:
    raise RuntimeError(f"Decode failed: {err}")

waveform, sr, err = load_audio_bytes(audio_bytes)
if err is not None or waveform is None or sr is None:
    raise RuntimeError(f"Load failed: {err}")

print("Waveform shape:", waveform.shape)
print("Sample rate:", sr)
