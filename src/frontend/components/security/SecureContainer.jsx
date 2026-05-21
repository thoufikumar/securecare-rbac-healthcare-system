import React, { useState, useEffect } from 'react';

/**
 * SecureContainer wraps sensitive UI sections.
 * Blurs content when the window loses focus and disables interactions.
 */
const SecureContainer = ({ children, secure = true }) => {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    if (!secure) return;

    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    // Cleanup
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [secure]);

  const secureStyles = {
    filter: isBlurred ? 'blur(12px)' : 'none',
    transition: 'filter 0.3s ease',
    userSelect: secure ? 'none' : 'auto',
    WebkitUserSelect: secure ? 'none' : 'auto',
    position: 'relative',
    pointerEvents: isBlurred ? 'none' : 'auto'
  };

  const handleContextMenu = (e) => {
    if (secure) e.preventDefault();
  };

  return (
    <div 
      className={`secure-container ${isBlurred ? 'blurred' : ''}`}
      style={secureStyles}
      onContextMenu={handleContextMenu}
    >
      {isBlurred && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          background: 'rgba(255,255,255,0.9)',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontWeight: '600',
          color: '#1e3a8a',
          textAlign: 'center'
        }}>
          🛡️ Secure View Enabled<br/>
          <span style={{ fontSize: '12px', fontWeight: '400', color: '#64748b' }}>Focus window to reveal data</span>
        </div>
      )}
      {children}
    </div>
  );
};

export default SecureContainer;
