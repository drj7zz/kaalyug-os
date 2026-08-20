import React, { useState, useEffect, useCallback } from 'react';
import './Desktop.css';
import { Wifi, Battery, Search, User, Folder, Briefcase, Mail, Settings, Lock, HelpCircle } from 'lucide-react';
import Window from './Window';

const apps = [
  { id: 'basic_info', title: 'Basic Information', icon: User, color: '#34C759' },
  { id: 'projects', title: 'Projects', icon: Briefcase, color: '#007AFF' },
  { id: 'contact', title: 'Contact', icon: Mail, color: '#FF9500' },
  { id: 'settings', title: 'Settings', icon: Settings, color: '#8E8E93' },
  { id: 'support', title: 'Customer Care', icon: HelpCircle, color: '#FF3B30' }
];

const desktopShortcuts = [
  { id: 'basic_info', title: 'Basic Info', icon: Folder },
  { id: 'projects', title: 'Projects', icon: Folder },
  { id: 'support', title: 'Customer Care', icon: Folder }
];

const Desktop = ({ theme, setTheme, onLock, initialAppToOpen, clearInitialApp }) => {
  const [time, setTime] = useState(new Date());
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = useCallback((app) => {
    setOpenWindows(prev => {
      if (!prev.find(w => w.id === app.id)) {
        return [...prev, app];
      }
      return prev;
    });
    setMinimizedWindows(prev => prev.filter(id => id !== app.id));
    setActiveWindow(app.id);
  }, []);

  const toggleApp = useCallback((app) => {
    const isOpen = openWindows.find(w => w.id === app.id);
    if (isOpen) {
      if (activeWindow === app.id && !minimizedWindows.includes(app.id)) {
        setMinimizedWindows(prev => [...prev, app.id]);
        setActiveWindow(null);
      } else {
        setMinimizedWindows(prev => prev.filter(id => id !== app.id));
        setActiveWindow(app.id);
      }
    } else {
      openApp(app);
    }
  }, [openWindows, activeWindow, minimizedWindows, openApp]);

  useEffect(() => {
    if (initialAppToOpen) {
      const targetApp = apps.find(a => a.id === initialAppToOpen);
      if (targetApp) {
        openApp(targetApp);
      }
      if (clearInitialApp) clearInitialApp();
    }
  }, [initialAppToOpen, openApp, clearInitialApp]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const closeApp = useCallback((appId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== appId));
    setMinimizedWindows(prev => prev.filter(id => id !== appId));
    setActiveWindow(prevActive => prevActive === appId ? null : prevActive);
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) setSearchQuery('');
  };

  const handleMenuClick = (menu) => {
    if (menu === 'View') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    } else if (menu === 'Settings') {
      const settingsApp = apps.find(a => a.id === 'settings');
      openApp(settingsApp);
    } else if (menu === 'Customer Care') {
      const supportApp = apps.find(a => a.id === 'support');
      openApp(supportApp);
    }
  };

  return (
    <div className="desktop-container">
      {/* Menu Bar */}
      <div className="menu-bar glass-panel">
        <div className="menu-left">
          <div className="apple-logo-img" title="Lock Screen" onClick={onLock}>
            <img src="/bg.jpeg" alt="Logo" width={22} height={22} style={{ borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <span className="menu-item fw-bold">Kalyug OS</span>
          <span className="menu-item">File</span>
          <span className="menu-item">Edit</span>
          <span className="menu-item" onClick={() => handleMenuClick('View')}>View</span>
          <span className="menu-item" onClick={() => handleMenuClick('Settings')}>Settings</span>
          <span className="menu-item" onClick={() => handleMenuClick('Customer Care')}>Support</span>
        </div>
        <div className="menu-right">
          <span className="menu-icon" onClick={toggleSearch} title="Search"><Search size={16} /></span>
          <span className="menu-icon" onClick={onLock} title="Lock Screen"><Lock size={15} /></span>
          <span className="menu-icon"><Wifi size={16} /></span>
          <span className="menu-icon"><Battery size={16} /></span>
          <span className="menu-time">{formatTime(time)}</span>
        </div>
      </div>

      {/* Workspace & Shortcuts */}
      <div className="workspace">
        <div className="desktop-icons">
          {desktopShortcuts.map(shortcut => {
            const Icon = shortcut.icon;
            const fullApp = apps.find(a => a.id === shortcut.id);
            return (
              <div 
                key={shortcut.id} 
                className="desktop-shortcut" 
                onClick={() => openApp(fullApp)}
              >
                <div className="shortcut-icon-wrapper">
                  <Icon size={48} color="#007AFF" fill="rgba(0,122,255,0.2)" />
                </div>
                <span className="shortcut-title">{shortcut.title}</span>
              </div>
            );
          })}
        </div>

        {openWindows.map(app => (
          <Window 
            key={app.id} 
            app={app} 
            isActive={activeWindow === app.id}
            isMinimized={minimizedWindows.includes(app.id)}
            onFocus={() => {
              setActiveWindow(app.id);
              setMinimizedWindows(prev => prev.filter(id => id !== app.id));
            }}
            onClose={() => closeApp(app.id)}
            onMinimize={() => {
              setMinimizedWindows(prev => [...prev, app.id]);
              if (activeWindow === app.id) setActiveWindow(null);
            }}
            theme={theme}
            setTheme={setTheme}
          />
        ))}

        {/* Spotlight Search Overlay */}
        {showSearch && (
          <div className="spotlight-overlay" onClick={toggleSearch}>
            <div className="spotlight-container glass-panel" onClick={e => e.stopPropagation()}>
              <Search size={24} color="#888" />
              <input 
                type="text" 
                placeholder="Search portfolio..." 
                autoFocus 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dock */}
      <div className="dock-container">
        <div className="dock glass-panel">
          {apps.map(app => {
            const Icon = app.icon;
            const isOpen = openWindows.find(w => w.id === app.id);
            return (
              <div 
                key={app.id} 
                className="dock-item" 
                onClick={() => toggleApp(app)}
                title={app.title}
              >
                <div className="dock-icon" style={{ backgroundColor: app.color }}>
                  <Icon size={24} color="#fff" />
                </div>
                {isOpen && <div className="dock-indicator" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Desktop;
