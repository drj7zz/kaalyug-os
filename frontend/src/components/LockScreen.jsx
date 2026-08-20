import React, { useState, useEffect, useCallback, useRef } from 'react';
import './LockScreen.css';
import { ArrowRight, Wifi, Battery, Volume2 } from 'lucide-react';

const LockScreen = ({ onUnlock, onOpenAppOnUnlock }) => {
  const [time, setTime] = useState(new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
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
    // Accept any input or empty for portfolio unlock
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
  }, [showPasswordField, handleUnlockTrigger]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className={`lockscreen-container ${isUnlocking ? 'unlock-anim' : ''}`}
      onClick={() => { if (!showPasswordField) { setShowPasswordField(true); setTimeout(() => inputRef.current?.focus(), 100); } }}
    >
      {/* Blurred wallpaper background — simple bg image + blur */}
      <div className="lockscreen-bg" />

      {/* Top status bar */}
      <div className="ls-topbar">
        <div className="ls-topbar-left" />
        <div className="ls-topbar-right">
          <Wifi size={14} color="rgba(255,255,255,0.85)" />
          <Volume2 size={14} color="rgba(255,255,255,0.85)" />
          <Battery size={14} color="rgba(255,255,255,0.85)" />
        </div>
      </div>

      {/* Clock — top center */}
      <div className="ls-clock-section">
        <div className="ls-clock">{formatTime(time)}</div>
        <div className="ls-date">{formatDate(time)}</div>
      </div>

      {/* User profile — center */}
      <div className="ls-user-section">
        <div
          className={`ls-avatar-ring ${showPasswordField ? 'focused' : ''}`}
          onClick={(e) => { e.stopPropagation(); handleAvatarClick(); }}
        >
          <img src="/drj1.jpg" alt="Dirghraj Giri" className="ls-avatar-img" loading="eager" decoding="sync" fetchPriority="high" />
        </div>

        <div className="ls-username">Dirghraj Giri</div>

        {/* Password field — slides in like macOS */}
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

        {/* Hint when field not shown */}
        {!showPasswordField && (
          <div className="ls-click-hint">Click to unlock</div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="ls-bottom-bar">
        <button className="ls-bottom-btn" onClick={(e) => { e.stopPropagation(); handleUnlockTrigger('support'); }}>
          Help & Support
        </button>
      </div>
    </div>
  );
};

export default LockScreen;
