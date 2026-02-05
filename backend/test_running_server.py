#!/usr/bin/env python3
"""
Test script to verify a running VakyaGuard backend server
Run this after starting the server with: python -m uvicorn main:app --reload
"""
import requests
import json
from io import BytesIO

def test_health_endpoint():
    """Test the health endpoints"""
    print("🏥 Testing health endpoints...")
    
    try:
        # Test root endpoint
        response = requests.get("http://127.0.0.1:8000/")
        print(f"✅ Root endpoint (/) - Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        # Test health endpoint
        response = requests.get("http://127.0.0.1:8000/health")
        print(f"✅ Health endpoint (/health) - Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running on http://127.0.0.1:8000?")
        return False
    except Exception as e:
        print(f"❌ Health endpoint test failed: {e}")
        return False

def test_analyze_endpoints():
    """Test the analyze endpoints with mock file upload"""
    print("\n🎵 Testing analyze endpoints...")
    
    # Create a mock audio file
    mock_audio_content = b"This is mock audio data for testing the upload functionality"
    files = {"file": ("test_audio.wav", BytesIO(mock_audio_content), "audio/wav")}
    
    endpoints = [
        ("/analyze", "Main analyze endpoint"),
        ("/v1/voice/analyze", "V1 analyze endpoint")
    ]
    
    results = []
    
    for endpoint, description in endpoints:
        try:
            print(f"\n🧪 Testing {description} ({endpoint})...")
            
            # Reset file pointer
            files["file"] = ("test_audio.wav", BytesIO(mock_audio_content), "audio/wav")
            
            response = requests.post(f"http://127.0.0.1:8000{endpoint}", files=files)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("   ✅ Response structure:")
                print(f"      Decision: {data.get('decision')}")
                print(f"      Synthetic probability: {data.get('provenance', {}).get('synthetic_probability')}")
                print(f"      Human probability: {data.get('provenance', {}).get('human_probability')}")
                print(f"      Confidence: {data.get('scores', {}).get('confidence')}")
                print(f"      Explanation: {data.get('explanation', '')[:100]}...")
                results.append(True)
            else:
                print(f"   ❌ Unexpected status: {response.status_code}")
                print(f"   Response: {response.text}")
                results.append(False)
                
        except requests.exceptions.ConnectionError:
            print("   ❌ Cannot connect to server")
            results.append(False)
        except Exception as e:
            print(f"   ❌ Test failed: {e}")
            results.append(False)
    
    return all(results)

def test_swagger_ui():
    """Test if Swagger UI is accessible"""
    print("\n📚 Testing Swagger UI...")
    
    try:
        response = requests.get("http://127.0.0.1:8000/docs")
        if response.status_code == 200:
            print("✅ Swagger UI is accessible at http://127.0.0.1:8000/docs")
            return True
        else:
            print(f"❌ Swagger UI returned status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Swagger UI test failed: {e}")
        return False

def main():
    """Run all tests against a running server"""
    print("🔬 VakyaGuard Backend Live Server Test")
    print("=" * 50)
    print("📋 Prerequisites:")
    print("   1. Server must be running: python -m uvicorn main:app --reload")
    print("   2. Server should be accessible at http://127.0.0.1:8000")
    print("=" * 50)
    
    # Run tests
    health_ok = test_health_endpoint()
    analyze_ok = test_analyze_endpoints()
    swagger_ok = test_swagger_ui()
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"   Health endpoints: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"   Analyze endpoints: {'✅ PASS' if analyze_ok else '❌ FAIL'}")
    print(f"   Swagger UI: {'✅ PASS' if swagger_ok else '❌ FAIL'}")
    
    all_passed = health_ok and analyze_ok and swagger_ok
    
    if all_passed:
        print("\n🎉 All tests PASSED!")
        print("✨ The backend is working correctly and ready for frontend integration!")
        print("\n🌐 Available endpoints:")
        print("   - Health: http://127.0.0.1:8000/")
        print("   - Health check: http://127.0.0.1:8000/health")
        print("   - Analysis: http://127.0.0.1:8000/analyze")
        print("   - Analysis (v1): http://127.0.0.1:8000/v1/voice/analyze")
        print("   - Swagger UI: http://127.0.0.1:8000/docs")
        print("\n🎯 Frontend integration ready!")
        print("   The frontend can now connect to the backend and perform audio analysis.")
    else:
        print("\n❌ Some tests FAILED!")
        print("💡 Please check:")
        print("   1. Is the server running? python -m uvicorn main:app --reload")
        print("   2. Is it accessible at http://127.0.0.1:8000?")
        print("   3. Check the error messages above for specific issues.")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)