import React from 'react';
import { Shield } from 'lucide-react';

const SimpleTraceApp: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-cyan-500 selection:text-white bg-black">
      {/* Background Atmosphere Layers */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Deep colored nebula glows */}
        <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] bg-[#4aa3b8]/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center p-4 md:p-12">
        <header className="w-full max-w-6xl flex flex-col items-center justify-center mb-24 mt-8">
          <div className="text-center group cursor-pointer relative">
            <div className="flex flex-col items-center gap-4">
              <div className="relative mb-2">
                <Shield className="w-14 h-14 text-orange-500 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 w-14 h-14 text-orange-500 blur-2xl opacity-40 animate-pulse" />
              </div>
              <h1 className="text-7xl md:text-[9rem] font-black tracking-[0.45em] text-[#ff7a18] transition-all duration-700 hover:scale-[1.02] italic drop-shadow-[0_0_60px_rgba(255,122,24,0.4)] leading-none">
                TRACE
              </h1>
            </div>
            
            <div className="flex flex-col items-center gap-4 mt-12">
              <div className="flex items-center justify-center gap-8">
                <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#4aa3b8]/80 to-transparent" />
                <p className="text-[#4aa3b8] text-[12px] md:text-sm font-black uppercase tracking-[1em] leading-relaxed mono drop-shadow-[0_0_15px_rgba(74,163,184,0.6)]">
                  SIGNAL INTELLIGENCE UNIT
                </p>
                <div className="h-[1px] w-28 bg-gradient-to-l from-transparent via-[#4aa3b8]/80 to-transparent" />
              </div>
            </div>
          </div>
        </header>

        <main className="w-full max-w-6xl relative z-20">
          <div className="bg-black/80 border border-white/10 rounded-[2rem] backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden p-8">
            <h2 className="text-2xl font-black text-white mb-4">Analysis Hub</h2>
            <p className="text-slate-400">TRACE frontend is loading...</p>
            <div className="mt-4 flex gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-spin" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SimpleTraceApp;