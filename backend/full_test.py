#!/usr/bin/env python3
"""
Full integration test for the VakyaGuard backend
"""
import sys
import os
import json
import time
import subprocess
import threading
from io import BytesIO

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_server_startup():
    """Test if the server can start successfully"""
    print("🚀 Testing server startup...")
    
    try:
        # Import the main module
        import main
        app = main.app
        print(f"✅ FastAPI app created: {app.title}")
        
        # Test that we can create a test client
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test health endpoint
        response = client.get("/")
        print(f"✅ Health endpoint response: {response.status_code}")
        print(f"   Response body: {response.json()}")
        
        # Test health check endpoint
        response = client.get("/health")
        print(f"✅ Health check endpoint response: {response.status_code}")
        print(f"   Response body: {response.json()}")
        
        return client
        
    except Exception as e:
        print(f"❌ Server startup test failed: {e}")
        return None

def test_analyze_endpoint(client):
    """Test the analyze endpoint with a mock file"""
    print("\n🧪 Testing /analyze endpoint...")
    
    try:
        # Create a mock audio file
        mock_audio_content = b"mock audio data for testing"
        files = {"file": ("test_audio.wav", BytesIO(mock_audio_content), "audio/wav")}
        
        # Test the analyze endpoint
        response = client.post("/analyze", files=files)
        print(f"✅ Analyze endpoint response: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Response structure:")
            print(f"   Decision: {data.get('decision')}")
            print(f"   Synthetic probability: {data.get('provenance', {}).get('synthetic_probability')}")
            print(f"   Confidence: {data.get('scores', {}).get('confidence')}")
            return True
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Analyze endpoint test failed: {e}")
        return False

def test_v1_analyze_endpoint(client):
    """Test the v1/voice/analyze endpoint with a mock file"""
    print("\n🧪 Testing /v1/voice/analyze endpoint...")
    
    try:
        # Create a mock audio file
        mock_audio_content = b"mock audio data for testing"
        files = {"file": ("test_audio.wav", BytesIO(mock_audio_content), "audio/wav")}
        
        # Test the v1 analyze endpoint
        response = client.post("/v1/voice/analyze", files=files)
        print(f"✅ V1 analyze endpoint response: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Response structure:")
            print(f"   Decision: {data.get('decision')}")
            print(f"   Synthetic probability: {data.get('provenance', {}).get('synthetic_probability')}")
            print(f"   Confidence: {data.get('scores', {}).get('confidence')}")
            return True
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ V1 analyze endpoint test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🔬 VakyaGuard Backend Full Integration Test")
    print("=" * 60)
    
    # Test server startup
    client = test_server_startup()
    if not client:
        print("\n❌ Server startup failed. Cannot continue with endpoint tests.")
        return False
    
    # Test endpoints
    analyze_ok = test_analyze_endpoint(client)
    v1_analyze_ok = test_v1_analyze_endpoint(client)
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary:")
    print(f"   Server startup: {'✅ PASS' if client else '❌ FAIL'}")
    print(f"   /analyze endpoint: {'✅ PASS' if analyze_ok else '❌ FAIL'}")
    print(f"   /v1/voice/analyze endpoint: {'✅ PASS' if v1_analyze_ok else '❌ FAIL'}")
    
    all_passed = client and analyze_ok and v1_analyze_ok
    
    if all_passed:
        print("\n🎉 All tests PASSED!")
        print("✨ The backend is ready for frontend integration!")
        print("\n🚀 To start the server manually:")
        print("   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000")
        print("\n📍 Server endpoints:")
        print("   - Health: http://127.0.0.1:8000/")
        print("   - Swagger UI: http://127.0.0.1:8000/docs")
        print("   - Analysis: http://127.0.0.1:8000/analyze")
        print("   - Analysis (v1): http://127.0.0.1:8000/v1/voice/analyze")
    else:
        print("\n❌ Some tests FAILED!")
        print("💡 Please check the error messages above and fix any issues.")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)