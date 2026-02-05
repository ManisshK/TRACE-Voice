// Simple backend health check
export const checkBackend = async () => {
  console.log('🔍 Checking backend connectivity...');
  
  try {
    const response = await fetch('http://127.0.0.1:8000/', {
      method: 'GET',
      mode: 'cors'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is running:', data);
      return true;
    } else {
      console.log('❌ Backend responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Cannot connect to backend:', error);
    console.log('💡 To start the backend:');
    console.log('   1. Open a new terminal');
    console.log('   2. cd backend');
    console.log('   3. python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000');
    return false;
  }
};

// Make available globally
(window as any).checkBackend = checkBackend;

// Auto-check on load
checkBackend();