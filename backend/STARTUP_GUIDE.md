# VakyaGuard Backend Startup Guide

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Test Imports (Optional)
```bash
python test_imports.py
```

### 3. Start the Server
```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Or on Windows, double-click: `start_server.bat`

### 4. Verify Server is Running
- Open browser to: http://127.0.0.1:8000
- Should see: `{"status": "Backend running"}`
- Swagger UI: http://127.0.0.1:8000/docs

## API Endpoints

### Health Check
- **GET** `/` - Returns server status
- **GET** `/health` - Returns health status

### Audio Analysis
- **POST** `/analyze` - Upload audio file for analysis
- **POST** `/v1/voice/analyze` - Alternative endpoint (matches existing API)

Both analysis endpoints accept:
- **file**: Audio file (multipart/form-data)

Both return the same mock response format:
```json
{
  "decision": "SYNTHETIC",
  "scores": {
    "authenticity_score": 0.14,
    "trust_index": 0.18,
    "confidence": 0.92
  },
  "provenance": {
    "human_probability": 0.14,
    "synthetic_probability": 0.86
  },
  "signals": {
    "aasist": {"confidence": 0.90, "weight": 0.40},
    "hfi": {"confidence": 0.87, "weight": 0.35},
    "tns": {"confidence": 0.85, "weight": 0.25}
  },
  "explanation": "Analysis detected multiple indicators of AI-generated speech..."
}
```

## CORS Configuration
The server is configured to accept requests from any origin (`*`) for development purposes.
In production, update the `allow_origins` list to specify exact frontend URLs.

## Troubleshooting

### Import Errors
If you get import errors, ensure all dependencies are installed:
```bash
pip install fastapi uvicorn python-multipart
```

### Port Already in Use
If port 8000 is busy, use a different port:
```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

### Virtual Environment
If using a virtual environment, make sure it's activated:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

## Frontend Integration
The frontend expects the backend at `http://localhost:8000/v1/voice/analyze`.
The server provides both `/analyze` and `/v1/voice/analyze` endpoints for compatibility.