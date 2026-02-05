@echo off
echo Starting VakyaGuard Backend...
cd backend
echo Current directory: %cd%
echo.
echo Starting FastAPI server...
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause