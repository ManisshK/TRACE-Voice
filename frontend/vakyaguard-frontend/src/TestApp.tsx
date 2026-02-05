import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-6xl font-black text-orange-500 mb-8">TRACE</h1>
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        <h2 className="text-2xl text-cyan-400 mb-4">Test Component</h2>
        <p className="text-gray-300">If you can see this styled content, Tailwind CSS is working!</p>
        <div className="mt-4 flex gap-4">
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default TestApp;