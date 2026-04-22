import React from 'react';

const Footer = () => (
  <footer style={{
    borderTop: '1px solid var(--border)',
    padding: '0.75rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(4,4,10,0.9)',
    marginLeft: 'var(--sidebar-width)',
    zIndex: 10,
    position: 'relative',
  }}>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
      
    </span>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
      ENGINE: <span style={{ color: 'var(--cyan)' }}>ONLINE</span> · API: <span style={{ color: 'var(--cyan)' }}>127.0.0.1:8000</span>
    </span>
  </footer>
);
export default Footer;