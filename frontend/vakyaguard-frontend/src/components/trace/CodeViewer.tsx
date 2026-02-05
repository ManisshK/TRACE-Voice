import React from 'react';
import { Code2, Terminal, Cpu, Database } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const aasistCode = `# AASIST Graph Attention Network
# Heterogeneous Spectro-Temporal Analysis

import torch
import torch.nn as nn
from torch_geometric.nn import GATConv

class HtrgGAT(nn.Module):
    def __init__(self, input_dim=128, hidden_dims=[64, 32]):
        super(HtrgGAT, self).__init__()
        
        # Sinc-Convolutional Frontend
        self.sinc_conv = SincConv1D(
            out_channels=128,
            kernel_size=251,
            sample_rate=16000
        )
        
        # Graph Attention Layers
        self.gat_layers = nn.ModuleList([
            GATConv(input_dim, hidden_dims[0], heads=8),
            GATConv(hidden_dims[0] * 8, hidden_dims[1], heads=1)
        ])
        
        # Temperature Scaling
        self.temperature = nn.Parameter(
            torch.tensor([2.0, 2.0, 100.0, 100.0])
        )
        
        # Classification Head
        self.classifier = nn.Linear(hidden_dims[1], 2)
        
    def forward(self, x, edge_index):
        # Sinc-Conv Feature Extraction
        x = self.sinc_conv(x)
        
        # Graph Attention Processing
        for gat in self.gat_layers:
            x = torch.relu(gat(x, edge_index))
            
        # Temperature-Scaled Output
        logits = self.classifier(x)
        return torch.softmax(logits / self.temperature, dim=-1)

# TRACE Forensic Pipeline
class TRACEForensics:
    def __init__(self):
        self.aasist = HtrgGAT()
        self.confidence_threshold = 0.85
        
    def analyze_audio(self, audio_tensor):
        with torch.no_grad():
            # Extract spectro-temporal features
            features = self.extract_features(audio_tensor)
            
            # Build heterogeneous graph
            edge_index = self.build_graph(features)
            
            # Forward pass through AASIST
            predictions = self.aasist(features, edge_index)
            
            # Generate forensic report
            return self.generate_report(predictions)`;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="p-3 bg-[#4aa3b8]/10 rounded-xl">
            <Code2 className="w-8 h-8 text-[#4aa3b8]" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">
            GAT Logic Core
          </h2>
        </div>
        <p className="text-slate-400 text-[12px] mono font-bold uppercase tracking-[0.3em]">
          Heterogeneous Graph Attention Network Implementation
        </p>
      </div>

      {/* Code Display */}
      <div className="bg-black/80 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-black/60 border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Terminal className="w-4 h-4 text-[#4aa3b8]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mono">
              aasist_core.py // STRATAGEM_CLASSIFIED
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
        </div>

        {/* Code Content */}
        <div className="p-8 overflow-x-auto">
          <pre className="text-[11px] leading-relaxed font-mono text-slate-300">
            <code dangerouslySetInnerHTML={{ __html: highlightCode(aasistCode) }} />
          </pre>
        </div>
      </div>

      {/* Technical Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black/40 border border-white/5 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Cpu className="w-5 h-5 text-orange-500" />
            <h3 className="text-[12px] font-black text-slate-300 uppercase tracking-[0.2em] mono">
              Architecture Details
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 mono font-bold">Input Channels</span>
              <span className="text-[10px] text-white mono font-black">128</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 mono font-bold">GAT Dimensions</span>
              <span className="text-[10px] text-white mono font-black">[64, 32]</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 mono font-bold">Attention Heads</span>
              <span className="text-[10px] text-white mono font-black">8 → 1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 mono font-bold">Temperature Scale</span>
              <span className="text-[10px] text-white mono font-black">[2.0, 2.0, 100.0, 100.0]</span>
            </div>
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Database className="w-5 h-5 text-emerald-500" />
            <h3 className="text-[12px] font-black text-slate-300 uppercase tracking-[0.2em] mono">
              Processing Specs
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 mono font-bold">Sample Rate</span>
              <span className="text-[10px] text-white mono font-black">16 kHz</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 mono font-bold">Kernel Size</span>
              <span className="text-[10px] text-white mono font-black">251</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 mono font-bold">Graph Type</span>
              <span className="text-[10px] text-white mono font-black">Heterogeneous</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 mono font-bold">Output Classes</span>
              <span className="text-[10px] text-white mono font-black">2 (Bonafide/Spoof)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center pt-8 border-t border-white/5">
        <p className="text-[9px] text-slate-600 mono font-bold uppercase tracking-[0.4em]">
          Proprietary AASIST Implementation // Team STRATAGEM // Classification: RESTRICTED
        </p>
      </div>
    </div>
  );
};

// Simple syntax highlighting function
const highlightCode = (code: string): string => {
  return code
    .replace(/(class|def|import|from|return|with|for|if|else|torch|nn)/g, '<span style="color: #ff7a18; font-weight: bold;">$1</span>')
    .replace(/(#.*$)/gm, '<span style="color: #4aa3b8; font-style: italic;">$1</span>')
    .replace(/(".*?")/g, '<span style="color: #10b981;">$1</span>')
    .replace(/(\d+\.?\d*)/g, '<span style="color: #f59e0b;">$1</span>')
    .replace(/(self|True|False|None)/g, '<span style="color: #8b5cf6;">$1</span>');
};