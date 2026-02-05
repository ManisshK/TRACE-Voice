#!/usr/bin/env python3
"""
Verify the FastAPI setup works correctly
"""
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_main_import():
    """Test if main.py can be imported successfully"""
    try:
        print("🧪 Testing main.py import...")
        import main
        print("✅ main.py imported successfully")
        
        print("🧪 Testing FastAPI app...")
        app = main.app
        print(f"✅ FastAPI app found: {app.title}")
        
        print("🧪 Testing routes...")
        routes = [route.path for route in app.routes]
        print(f"✅ Available routes: {routes}")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_dependencies():
    """Test if all required dependencies are available"""
    dependencies = [
        ('fastapi', 'FastAPI'),
        ('uvicorn', 'uvicorn'),
        ('fastapi.middleware.cors', 'CORSMiddleware')
    ]
    
    all_good = True
    for module, item in dependencies:
        try:
            print(f"🧪 Testing {module}...")
            __import__(module)
            print(f"✅ {module} is available")
        except ImportError:
            print(f"❌ {module} is missing")
            all_good = False
    
    return all_good

if __name__ == "__main__":
    print("🚀 VakyaGuard Backend Setup Verification")
    print("=" * 50)
    
    deps_ok = test_dependencies()
    main_ok = test_main_import()
    
    print("\n" + "=" * 50)
    if deps_ok and main_ok:
        print("🎉 Setup verification PASSED!")
        print("✨ You can now start the server with:")
        print("   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000")
        print("\n📍 Server will be available at:")
        print("   - Health check: http://127.0.0.1:8000/")
        print("   - Swagger UI: http://127.0.0.1:8000/docs")
        print("   - Analysis endpoint: http://127.0.0.1:8000/analyze")
    else:
        print("❌ Setup verification FAILED!")
        print("💡 Please install missing dependencies:")
        print("   pip install -r requirements.txt")