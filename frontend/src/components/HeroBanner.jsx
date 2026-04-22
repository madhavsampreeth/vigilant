import React from 'react';
import '../styles/cards.css';

const HeroBanner = () => (
  <div className="glass-card hero-banner">
    <div className="hero-content">
      <div className="hero-eyebrow">Anti-Piracy Intelligence Platform</div>
      <h1 className="hero-title">
        Protect Your <span className="highlight">Digital Assets</span>
      </h1>
      <p className="hero-sub">
        Real-time video fingerprinting & piracy detection. Monitor, analyze, and neutralize unauthorized content distribution.
      </p>
    </div>
    <div className="hero-visual">
      <div className="hero-ring"/>
      <div className="hero-ring"/>
      <div className="hero-dot"/>
    </div>
  </div>
);
export default HeroBanner;