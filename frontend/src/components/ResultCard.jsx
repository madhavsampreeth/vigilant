import React from 'react';
import '../styles/result.css';

const ResultCard = ({ result }) => {
  if (!result) return null;
  const { similarity, status } = result;
  const pct = typeof similarity === 'number' ? similarity : parseFloat(similarity);
  const isThreat = status?.toLowerCase() === 'pirated' || pct >= 75;
  const cls = isThreat ? 'threat' : 'safe';
  const verdict = isThreat ? '⚠ PIRACY DETECTED' : '✓ STREAM CLEAR';
  const displayPct = isNaN(pct) ? '—' : `${pct.toFixed(1)}%`;

  return (
    <div className={`result-card ${cls}`}>
      <div className="result-header">
        <div className={`result-verdict ${cls}`}>{verdict}</div>
        <div className={`result-icon ${cls}`}>{isThreat ? '⚠' : '✓'}</div>
      </div>

      <div className="result-body">
        <div className="result-metric">
          <div className="result-metric-label">Similarity Score</div>
          <div className={`result-metric-value ${cls}`}>{displayPct}</div>
        </div>
        <div className="result-metric">
          <div className="result-metric-label">Status</div>
          <div className={`result-metric-value ${cls}`} style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
            {status || (isThreat ? 'PIRATED' : 'ORIGINAL')}
          </div>
        </div>
      </div>

      {!isNaN(pct) && (
        <div className="similarity-bar-wrap">
          <div className="similarity-bar-label">
            <span>FINGERPRINT MATCH</span>
            <span>{displayPct}</span>
          </div>
          <div className="similarity-bar-track">
            <div className={`similarity-bar-fill ${cls}`} style={{ width: `${Math.min(pct, 100)}%` }}/>
          </div>
        </div>
      )}
    </div>
  );
};
export default ResultCard;