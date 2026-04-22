import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" stroke="#00f0ff" strokeWidth="1.5" fill="none" opacity="0.4" />
            <circle cx="32" cy="32" r="20" stroke="#ff2244" strokeWidth="1" fill="none" opacity="0.3" />
            <polygon points="32,12 48,44 16,44" stroke="#00f0ff" strokeWidth="1.5" fill="none" />
            <circle cx="32" cy="32" r="4" fill="#00f0ff" />
            <line x1="32" y1="4" x2="32" y2="12" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="32" y1="52" x2="32" y2="60" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="4" y1="32" x2="12" y2="32" stroke="#ff2244" strokeWidth="1" />
            <line x1="52" y1="32" x2="60" y2="32" stroke="#ff2244" strokeWidth="1" />
          </svg>
        </div>
        <span className="navbar-brand-text">
          <span>VIGIL</span><em>.</em><span>ANT</span>
        </span>
      </Link>

      <div className="navbar-center">
        <div className="navbar-status">
          <div className="status-dot" />
          SYSTEMS OPERATIONAL
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-time">{time} UTC</div>

        <div className="navbar-alert-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="alert-badge">3</span>
        </div>

        <div className="navbar-user">
          <div className="user-avatar">OP</div>
          <span className="user-name">operator_01</span>
        </div>
      </div>
      <div className="navbar-scan-line" />
    </nav>
  );
};

export default Navbar;