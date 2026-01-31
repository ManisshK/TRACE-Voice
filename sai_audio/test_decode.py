from sai_audio.decode import decode_base64_audio
import base64

fake_audio = b"\x00" * 2048
fake_base64 = base64.b64encode(fake_audio).decode()

audio_bytes, err = decode_base64_audio(fake_base64)
print("Valid input error:", err)

audio_bytes, err = decode_base64_audio("")
print("Empty input error:", err)

audio_bytes, err = decode_base64_audio("hello123")
print("Random input error:", err)
