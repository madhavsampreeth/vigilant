import React from 'react';

const Loader = ({ size = 'md', text = 'Processing...' }) => {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const px = sizes[size] || 36;

  return (
    <div className="loader-wrap">
      <svg
        width={px}
        height={px}
        viewBox="0 0 36 36"
        fill="none"
        style={{ animation: 'rotate 1s linear infinite' }}
      >
        <circle cx="18" cy="18" r="15" stroke="rgba(0,240,255,0.15)" strokeWidth="2" />
        <path
          d="M18 3 A15 15 0 0 1 33 18"
          stroke="var(--cyan)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px var(--cyan))' }}
        />
        <circle cx="18" cy="3" r="2.5" fill="var(--cyan)" style={{ filter: 'drop-shadow(0 0 6px var(--cyan))' }} />
      </svg>
      {text && <span className="loader-text">{text}</span>}
      <style>{`
        .loader-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
        }
        .loader-text {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--cyan);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          animation: blink 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;