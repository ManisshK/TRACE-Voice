import React from 'react';
import { BookOpen, Cpu, Database, Shield, Zap, Activity, Brain, Target } from 'lucide-react';

export const EducationalPanel: React.FC = () => {
  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* AASIST Architecture */}
        <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 space-y-6 group hover:-translate-y-2 transition-all">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="p-3 bg-[#4aa3b8]/10 rounded-xl">
              <Brain className="w-6 h-6 text-[#4aa3b8]" />
            </div>
            <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-300 mono">AASIST Core</h3>
          </div>
          <div className="space-y-4">
            <p className="text-[12px] text-slate-400 leading-relaxed mono">
              Advanced Audio Spoofing Integrated Spectro-Temporal Graph Attention Network
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4aa3b8]/60" />
                <span className="text-[10px] text-slate-500 mono font-bold">Sinc-Conv Layers (128 channels)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4aa3b8]/60" />
                <span className="text-[10px] text-slate-500 mono font-bold">HtrgGAT Architecture</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4aa3b8]/60" />
                <span className="text-[10px] text-slate-500 mono font-bold">Spectral-Temporal Fusion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detection Methods */}
        <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 space-y-6 group hover:-translate-y-2 transition-all">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Target className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-300 mono">Detection Matrix</h3>
          </div>
          <div className="space-y-4">
            <p className="text-[12px] text-slate-400 leading-relaxed mono">
              Multi-signal forensic analysis for comprehensive spoof detection
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500/60" />
                <span className="text-[10px] text-slate-500 mono font-bold">Vocoder Artifact Detection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500/60" />
                <span className="text-[10px] text-slate-500 mono font-bold">Temporal Consistency Analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500/60" />
                <span className="text-[10px] text-slate-500 mono font-bold">Spectral Anomaly Mapping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 space-y-6 group hover:-translate-y-2 transition-all">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Cpu className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-300 mono">Tech Specs</h3>
          </div>
          <div className="space-y-4">
            <p className="text-[12px] text-slate-400 leading-relaxed mono">
              High-performance audio forensics with real-time processing
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                <span className="text-[10px] text-slate-500 mono font-bold">16kHz Sample Rate</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                <span className="text-[10px] text-slate-500 mono font-bold">Graph Attention [64, 32]</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                <span className="text-[10px] text-slate-500 mono font-bold">Temperature Scaling</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Technical Overview */}
      <div className="bg-black/30 border border-white/5 rounded-[3rem] p-16 space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase mb-4">
            Forensic Methodology
          </h2>
          <div className="h-1 w-32 bg-orange-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-200 tracking-tight mono">
                Graph Attention Networks
              </h3>
              <p className="text-slate-400 leading-relaxed text-[14px] mono">
                TRACE employs heterogeneous graph attention networks to model complex relationships 
                between spectral and temporal audio features. The HtrgGAT architecture enables 
                sophisticated pattern recognition across multiple signal domains.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-200 tracking-tight mono">
                Multi-Signal Fusion
              </h3>
              <p className="text-slate-400 leading-relaxed text-[14px] mono">
                Our forensic engine combines AASIST, HFI, and TNS detection algorithms with 
                weighted confidence scoring to provide comprehensive spoof detection across 
                various attack vectors and synthesis methods.
              </p>
            </div>
          </div>

          <div className="bg-black/60 border border-white/5 rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Database className="w-5 h-5 text-[#4aa3b8]" />
              <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mono">
                Processing Pipeline
              </span>
            </div>
            
            <div className="space-y-4">
              {[
                "Raw Audio Ingestion (16kHz)",
                "Sinc-Convolutional Feature Extraction",
                "Spectro-Temporal Graph Construction",
                "Heterogeneous Attention Computation",
                "Multi-Head Graph Attention Layers",
                "Temperature-Scaled Softmax Output",
                "Confidence Score Calibration",
                "Forensic Report Generation"
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#4aa3b8]/10 border border-[#4aa3b8]/20 flex items-center justify-center">
                    <span className="text-[10px] font-black text-[#4aa3b8] mono">{i + 1}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mono font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};