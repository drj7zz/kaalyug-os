import React, { useState, useEffect, useCallback, useRef } from 'react';
import './LockScreen.css';
import { ArrowRight, Wifi, Battery, Volume2, Mail, HelpCircle } from 'lucide-react';

const LockScreen = ({ onUnlock, onOpenAppOnUnlock }) => {
  const [time, setTime] = useState(new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlockTrigger = useCallback((targetAppId = null) => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    setTimeout(() => {
      onUnlock();
      if (targetAppId && onOpenAppOnUnlock) {
        onOpenAppOnUnlock(targetAppId);
      }
    }, 400);
  }, [isUnlocking, onUnlock, onOpenAppOnUnlock]);

  const handleAvatarClick = () => {
    if (!showPasswordField) {
      setShowPasswordField(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.length >= 0) {
      handleUnlockTrigger();
    } else {
      setShake(true);
      setPassword('');
      setTimeout(() => setShake(false), 500);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSupport && e.key === 'Escape') {
        setShowSupport(false);
        return;
      }
      if (e.key === 'Enter') {
        if (showPasswordField) {
          handleUnlockTrigger();
        } else {
          setShowPasswordField(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
      if (e.key === 'Escape') {
        setShowPasswordField(false);
        setPassword('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPasswordField, showSupport, handleUnlockTrigger]);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const formatDate = (date) => date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className={`lockscreen-container ${isUnlocking ? 'unlock-anim' : ''}`}
      onClick={() => { if (!showPasswordField && !showSupport) { setShowPasswordField(true); setTimeout(() => inputRef.current?.focus(), 100); } }}
    >
      {/* Wallpaper */}
      <div className="lockscreen-bg" />

      {/* Liquid Glass animated blobs */}
      <div className="ls-blob ls-blob-1" />
      <div className="ls-blob ls-blob-2" />
      <div className="ls-blob ls-blob-3" />
      <div className="ls-blob ls-blob-4" />

      {/* Top status bar */}
      <div className="ls-topbar">
        <div className="ls-topbar-left" />
        <div className="ls-topbar-right">
          <Wifi size={14} color="rgba(255,255,255,0.85)" />
          <Volume2 size={14} color="rgba(255,255,255,0.85)" />
          <Battery size={14} color="rgba(255,255,255,0.85)" />
        </div>
      </div>

      {/* Clock */}
      <div className="ls-clock-section">
        <div className="ls-clock">{formatTime(time)}</div>
        <div className="ls-date">{formatDate(time)}</div>
      </div>

      {/* User section with liquid glass card */}
      <div className="ls-user-section">
        <div className="ls-glass-card">
          <div
            className={`ls-avatar-ring ${showPasswordField ? 'focused' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleAvatarClick(); }}
          >
            <img src="/drj1.jpg" alt="Dirghraj Giri" className="ls-avatar-img" loading="eager" decoding="sync" fetchPriority="high" />
          </div>

          <div className="ls-username">Dirghraj Giri</div>

          {/* Password field */}
          <div className={`ls-password-section ${showPasswordField ? 'visible' : ''}`}>
            <form onSubmit={handlePasswordSubmit} onClick={(e) => e.stopPropagation()}>
              <div className={`ls-password-field ${shake ? 'shake' : ''}`}>
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="ls-password-input"
                  autoComplete="off"
                />
                <button type="submit" className="ls-password-btn">
                  <ArrowRight size={14} color="rgba(255,255,255,0.9)" />
                </button>
              </div>
            </form>
            <button className="ls-skip-btn" onClick={(e) => { e.stopPropagation(); handleUnlockTrigger(); }}>
              Use Touch ID
            </button>
          </div>

          {/* Hint */}
          {!showPasswordField && (
            <div className="ls-click-hint">Click to unlock</div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ls-bottom-bar">
        <button className="ls-bottom-btn" onClick={(e) => { e.stopPropagation(); setShowSupport(true); }}>
          <HelpCircle size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Help & Support
        </button>
      </div>

      {/* Lockscreen-only Support Overlay */}
      {showSupport && (
        <div className="ls-support-overlay" onClick={() => setShowSupport(false)}>
          <div className="ls-support-card" onClick={(e) => e.stopPropagation()}>
            <h2>Help & Support</h2>
            <p>Need help? Reach out through any of these channels:</p>
            <div className="ls-support-links">
              <a className="ls-support-link" href="mailto:giridirghraj@gmail.com" target="_blank" rel="noreferrer">
                <span className="ls-support-link-icon" style={{ background: 'rgba(234,67,53,0.22)' }}><Mail size={18} /></span>
                <span className="ls-support-link-info">
                  <span className="ls-support-link-name">Email Support</span>
                  <span className="ls-support-link-handle">giridirghraj@gmail.com</span>
                </span>
              </a>
              <a className="ls-support-link" href="https://github.com/drj7zz/giridirghraj/issues" target="_blank" rel="noreferrer">
                <span className="ls-support-link-icon" style={{ background: 'rgba(255,255,255,0.14)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                </span>
                <span className="ls-support-link-info">
                  <span className="ls-support-link-name">Report an Issue</span>
                  <span className="ls-support-link-handle">github.com/drj7zz</span>
                </span>
              </a>
            </div>
            <button className="ls-support-close" onClick={() => setShowSupport(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LockScreen;
