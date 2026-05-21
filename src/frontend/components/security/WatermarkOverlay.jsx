import React from 'react';
import useAuth from '../../../backend/modules/auth/useAuth';

/**
 * WatermarkOverlay renders a faint repeated watermark over clinical data.
 */
const WatermarkOverlay = ({ patientId }) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const timestamp = new Date().toLocaleDateString();
  const watermarkText = `SECURECARE • ${user?.email?.split('@')[0].toUpperCase()} • ${timestamp} • ${patientId ? `#${patientId.slice(-6)}` : 'SENSITIVE'}`;

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 5,
    overflow: 'hidden',
    opacity: 0.04,
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    padding: '40px',
    userSelect: 'none'
  };

  const rowStyle = {
    display: 'flex',
    gap: '60px',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    fontWeight: '800',
    letterSpacing: '2px'
  };

  return (
    <div style={overlayStyle} aria-hidden="true">
      {[...Array(15)].map((_, i) => (
        <div key={i} style={{ ...rowStyle, marginLeft: i % 2 === 0 ? '0px' : '-100px' }}>
          {[...Array(6)].map((_, j) => (
            <span key={j} style={{ transform: 'rotate(-15deg)' }}>{watermarkText}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WatermarkOverlay;
