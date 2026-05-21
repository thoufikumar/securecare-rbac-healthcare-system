import React, { useState, useEffect } from 'react';

/**
 * RevealField masks sensitive data and shows a decryption reveal flow.
 */
const RevealField = ({ label, value, onReveal }) => {
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (revealed && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setRevealed(false);
    }
    return () => clearInterval(timer);
  }, [revealed, timeLeft]);

  const handleReveal = async () => {
    if (onReveal) {
      setLoading(true);
      try {
        await onReveal();
        setRevealed(true);
        setTimeLeft(300); // 5 minutes
      } catch (e) {
        console.error("Reveal failed:", e);
      } finally {
        setLoading(false);
      }
    } else {
      setRevealed(true);
      setTimeLeft(300);
    }
  };

  return (
    <div className="reveal-field-wrapper" style={{ marginBottom: '16px' }}>
      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>{label}</label>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        padding: '8px 12px',
        background: revealed ? '#f0f9ff' : '#f8fafc',
        border: '1px solid',
        borderColor: revealed ? '#bae6fd' : '#e2e8f0',
        borderRadius: '8px',
        minHeight: '42px',
        transition: 'all 0.3s'
      }}>
        <span style={{ 
          fontFamily: revealed ? 'inherit' : 'monospace', 
          fontSize: revealed ? '14px' : '18px',
          fontWeight: revealed ? '600' : 'bold',
          color: revealed ? '#1e293b' : '#94a3b8',
          letterSpacing: revealed ? 'normal' : '2px',
          flex: 1
        }}>
          {revealed ? value : '••••••••'}
        </span>
        
        {loading ? (
          <div className="spinner-small" style={{ width: '16px', height: '16px' }}></div>
        ) : revealed ? (
          <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: '700', padding: '2px 8px', background: '#e0f2fe', borderRadius: '4px' }}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        ) : (
          <button 
            onClick={handleReveal}
            style={{ 
              background: 'white', 
              border: '1px solid #3b82f6', 
              color: '#3b82f6', 
              fontSize: '11px', 
              fontWeight: '700', 
              padding: '4px 10px', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            REVEAL
          </button>
        )}
      </div>
    </div>
  );
};

export default RevealField;
