import React, { useEffect, useState } from 'react';

type BackendResponse = {
  decision: string;
  scores: {
    authenticity_score: number;
    trust_index: number;
    confidence: number;
  };
  provenance: {
    human_probability: number;
    synthetic_probability: number;
  };
};

const TestApp: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [data, setData] = useState<BackendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runHealthCheck = async () => {
      setStatus('loading');

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/health`
        );

        if (!res.ok) {
          throw new Error('Backend health check failed');
        }

        setStatus('success');
      } catch (err) {
        setError('Backend not reachable');
        setStatus('error');
      }
    };

    runHealthCheck();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-6xl font-black text-orange-500 mb-8">
        TRACE
      </h1>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 space-y-4">
        <h2 className="text-2xl text-cyan-400">
          Backend Connectivity Test
        </h2>

        {status === 'loading' && (
          <p className="text-yellow-400">Checking backend status…</p>
        )}

        {status === 'success' && (
          <p className="text-emerald-400">
            ✅ Backend is LIVE and reachable
          </p>
        )}

        {status === 'error' && (
          <p className="text-red-500">
            ❌ {error}
          </p>
        )}

        <div className="pt-4 flex gap-4">
          <div className="w-4 h-
