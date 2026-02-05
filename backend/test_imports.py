#!/usr/bin/env python3
"""
Test script to verify all imports work correctly
"""

try:
    print("Testing FastAPI import...")
    from fastapi import FastAPI, UploadFile, File
    print("✅ FastAPI imported successfully")
    
    print("Testing CORS middleware import...")
    from fastapi.middleware.cors import CORSMiddleware
    print("✅ CORS middleware imported successfully")
    
    print("Testing app creation...")
    app = FastAPI()
    print("✅ FastAPI app created successfully")
    
    print("Testing CORS middleware addition...")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print("✅ CORS middleware added successfully")
    
    print("\n🎉 All imports and basic setup work correctly!")
    print("✨ The backend should start successfully with:")
    print("   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("💡 You may need to install missing dependencies:")
    print("   pip install fastapi uvicorn python-multipart")
    
except Exception as e:
    print(f"❌ Unexpected error: {e}")