import React, { useEffect, useState } from 'react';

const TestApp: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [backendUrl] = useState<string | undefined>(
    import.meta.env.VITE_BACKEND_URL
  );

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${backendUrl}/health`);
        if (!res.ok) throw new Error('Health check failed');
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };

    if (backendUrl) {
      checkBackend();
    } else {
      setStatus('error');
    }
  }, [backendUrl]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-6xl font-black text-orange-500 mb-8">TRACE</h1>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 space-y-4">
        <h2 className="text-2xl text-cyan-400">
          Backend Connectivity Test
        </h2>

        {status === 'loading' && (
          <p className="text-yellow-400">
            Checking backend status…
          </p>
        )}

        {status === 'success' && (
          <p className="text-emerald-400">
            ✅ Backend is LIVE and reachable
          </p>
        )}

        {status === 'error' && (
          <p className="text-red-500">
            ❌ Backend not reachable or env not set
          </p>
        )}

        <div className="flex gap-4 pt-4">
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
          <div className="w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-spin" />
        </div>

        <p className="text-gray-400 text-sm pt-4">
          Backend URL:
          <br />
          <span className="text-cyan-300 break-all">
            {backendUrl ?? 'NOT SET'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TestApp;
