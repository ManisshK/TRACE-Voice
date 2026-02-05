import React, { useEffect, useState } from 'react';
import './ResultDial.css';

interface AnalysisResults {
  syntheticProbability: number;
  verdict: 'LIKELY SYNTHETIC' | 'LIKELY HUMAN' | 'INCONCLUSIVE';
  confidence: number;
  explanation: string;
  technicalDetails: {
    biometricScore: number;
    temporalScore: number;
    spectralScore: number;
    forensicScore: number;
  };
}

interface ResultDialProps {
  analysisResults: AnalysisResults | null;
}

const ResultDial: React.FC<ResultDialProps> = ({ analysisResults }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Handle null analysis results
  if (!analysisResults) {
    return (
      <div className="result-dial-container">
        <div className="dial-section-header">
          <h3 className="dial-title">Analysis Results</h3>
          <div className="verdict-display">
            <span className="verdict-text">No results available</span>
          </div>
        </div>
      </div>
    );
  }
  
  const { syntheticProbability, verdict, confidence, explanation, technicalDetails } = analysisResults;
  const humanProbability = 100 - syntheticProbability;

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(syntheticProbability);
    }, 100);

    return () => clearTimeout(timer);
  }, [syntheticProbability]);

  // SVG circle calculations
  const radius = 80;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke-dashoffset for animated synthetic arc
  const syntheticOffset = circumference - (animatedValue / 100) * circumference;
  
  // Determine confidence level
  const getConfidenceLevel = (probability: number) => {
    if (probability >= 85) return 'High Confidence';
    if (probability >= 70) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const confidenceLevel = getConfidenceLevel(syntheticProbability);
  const isDominantSynthetic = syntheticProbability > 50;

  return (
    <div className="result-dial-container">
      <div className="dial-section-header">
        <h3 className="dial-title">Analysis Results</h3>
        <div className="verdict-display">
          <span className={`verdict-text ${verdict.toLowerCase().replace(' ', '-')}`}>
            {verdict}
          </span>
          <span className="confidence-text">
            {confidence}% Confidence
          </span>
        </div>
      </div>

      <div className="dial-chart-container">
        {/* SVG Donut Chart */}
        <div className="donut-chart">
          <svg width="200" height="200" className="dial-svg">
            {/* Background track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="rgba(51, 51, 51, 0.3)"
              strokeWidth={strokeWidth}
              className="background-track"
            />
            
            {/* Human segment (static) */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (humanProbability / 100) * circumference}
              className="human-arc"
              transform="rotate(-90 100 100)"
            />
            
            {/* Synthetic segment (animated) */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="url(#syntheticGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={syntheticOffset}
              className="synthetic-arc"
              transform={`rotate(${-90 + (humanProbability / 100) * 360} 100 100)`}
            />

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="syntheticGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Label */}
          <div className="dial-center-label">
            <div className="dial-percentage">
              {isDominantSynthetic ? `${syntheticProbability}%` : `${humanProbability}%`}
            </div>
            <div className="dial-origin-label">
              {isDominantSynthetic ? 'SYNTHETIC ORIGIN' : 'HUMAN ORIGIN'}
            </div>
            <div className="dial-confidence-label">
              {confidenceLevel}
            </div>
          </div>
        </div>

        {/* Supporting Probability Bars */}
        <div className="probability-bars">
          <div className="probability-bar-item">
            <div className="bar-label-row">
              <span className="bar-label">Human Probability</span>
              <span className="bar-percentage">{humanProbability}%</span>
            </div>
            <div className="bar-track">
              <div 
                className="bar-fill human-bar"
                style={{ width: `${humanProbability}%` }}
              ></div>
            </div>
          </div>

          <div className="probability-bar-item">
            <div className="bar-label-row">
              <span className="bar-label">Synthetic Probability</span>
              <span className="bar-percentage">{syntheticProbability}%</span>
            </div>
            <div className="bar-track">
              <div 
                className="bar-fill synthetic-bar"
                style={{ width: `${syntheticProbability}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="technical-details">
        <h4 className="technical-title">Technical Analysis</h4>
        <div className="technical-scores">
          <div className="score-item">
            <span className="score-label">Biometric</span>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${technicalDetails.biometricScore}%` }}></div>
            </div>
            <span className="score-value">{technicalDetails.biometricScore}%</span>
          </div>
          <div className="score-item">
            <span className="score-label">Temporal</span>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${technicalDetails.temporalScore}%` }}></div>
            </div>
            <span className="score-value">{technicalDetails.temporalScore}%</span>
          </div>
          <div className="score-item">
            <span className="score-label">Spectral</span>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${technicalDetails.spectralScore}%` }}></div>
            </div>
            <span className="score-value">{technicalDetails.spectralScore}%</span>
          </div>
          <div className="score-item">
            <span className="score-label">Forensic</span>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${technicalDetails.forensicScore}%` }}></div>
            </div>
            <span className="score-value">{technicalDetails.forensicScore}%</span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="analysis-explanation">
        <h4 className="explanation-title">Analysis Summary</h4>
        <p className="explanation-text">{explanation}</p>
      </div>
    </div>
  );
};

export default ResultDial;