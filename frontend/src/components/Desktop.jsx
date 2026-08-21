import React, { useState, useEffect, useCallback } from 'react';
import './Desktop.css';
import { Wifi, Battery, Search, User, Folder, FolderOpen, Files, Grid2X2, Briefcase, Mail, Settings, Lock, HelpCircle, Globe, Terminal, MessageSquare, MessageCircle, Sparkles, Bell, Info, BarChart3 } from 'lucide-react';
import Window from './Window';

const apps = [
  { id: 'basic_info', title: 'Basic Information', icon: User, color: '#34C759' },
  { id: 'projects', title: 'Projects', icon: Briefcase, color: '#007AFF' },
  { id: 'settings', title: 'Settings', icon: Settings, color: '#8E8E93' },
  { id: 'support', title: 'Customer Care', icon: HelpCircle, color: '#FF3B30' }
  ,{ id: 'browser', title: 'Browser', icon: Globe, color: '#0A84FF' }
  ,{ id: 'terminal', title: 'Terminal', icon: Terminal, color: '#1C1C1E' }
  ,{ id: 'finder', title: 'Finder', icon: Files, color: '#5AC8FA' }
  ,{ id: 'applications', title: 'Applications', icon: Grid2X2, color: '#34C759' }
  ,{ id: 'yug_ai', title: 'Yug AI', icon: Sparkles, color: '#AF52DE' }
  ,{ id: 'messages', title: 'Messages', icon: MessageCircle, color: '#007AFF' }
  ,{ id: 'analytics', title: 'GitHub Analytics', icon: BarChart3, color: '#30D158' }
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === 'k') { event.preventDefault(); setShowSearch(true); setSearchQuery(''); }
      if ((event.metaKey || event.ctrlKey) && key === 'l') { event.preventDefault(); onLock(); }
      if (key === 'escape') { setShowSearch(false); setShowNotifications(false); setShowTutorial(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onLock]);

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

  const formatMobileTime = (date) => date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

  const closeApp = useCallback((appId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== appId));
    setMinimizedWindows(prev => prev.filter(id => id !== appId));
    setActiveWindow(prevActive => prevActive === appId ? null : prevActive);
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) setSearchQuery('');
  };

  const searchableApps = apps.map(app => ({ ...app, keywords: ({ basic_info: 'about me dirghraj giri skills react javascript frontend madhesh nepal', projects: 'projects yugcoin wallet compliance financial tracker', contact: 'contact email github instagram', settings: 'settings themes appearance', support: 'support customer care help', browser: 'browser web internet', terminal: 'terminal commands shell', finder: 'applications app library', yug_ai: 'yug ai questions assistant' }[app.id] || app.title).toLowerCase() }));
  const searchResults = searchableApps.filter(app => app.keywords.toLowerCase().includes(searchQuery.toLowerCase()));

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
    } else if (menu === 'Applications') {
      openApp(apps.find(a => a.id === 'applications'));
    }
  };

  return (
    <div className="desktop-container">
      {/* Menu Bar */}
      <div className="menu-bar glass-panel">
        <div className="mobile-status-bar">
          <span>{formatMobileTime(time)}</span>
          <span className="dynamic-island" aria-label="Dynamic Island" />
          <div>
            <Wifi size={15} />
            <Battery size={16} />
            <button className="mobile-lock-button" onClick={onLock} aria-label="Lock screen" title="Lock screen">
              <Lock size={15} />
            </button>
            <button className="mobile-lock-button" onClick={toggleSearch} aria-label="Search applications" title="Search applications">
              <Search size={15} />
            </button>
          </div>
        </div>
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
          <span className="menu-item" onClick={() => handleMenuClick('Applications')}>Applications</span>
        </div>
        <div className="menu-right">
          <span className="menu-icon" onClick={toggleSearch} title="Search"><Search size={16} /></span>
          <span className="menu-icon" onClick={() => setShowNotifications(prev => !prev)} title="Notifications"><Bell size={15} /></span>
          <span className="menu-icon" onClick={() => setShowTutorial(true)} title="How to use"><Info size={15} /></span>
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

        <div className="mobile-app-grid">
          {apps.filter(app => !['finder', 'applications'].includes(app.id)).map(app => {
            const Icon = app.icon;
            return (
              <button key={app.id} className="mobile-app" onClick={() => openApp(app)}>
                <span className="mobile-app-icon" style={{ backgroundColor: app.color }}>
                  <Icon size={29} color="#fff" />
                </span>
                <span>{app.title === 'Basic Information' ? 'About Me' : app.title}</span>
              </button>
            );
          })}
          <button className="mobile-app all-apps-button" onClick={() => openApp(apps.find(app => app.id === 'applications'))}><span className="mobile-app-icon" style={{ backgroundColor: '#34C759' }}><Grid2X2 size={29} color="#fff" /></span><span>Applications</span></button>
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
            onOpenApp={openApp}
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
              {searchQuery && <div className="search-results">
                {searchResults.length ? searchResults.map(app => { const Icon = app.icon; return <button key={app.id} onClick={() => { openApp(app); setShowSearch(false); }}><Icon size={18} /><span>{app.title}</span></button>; }) : <span className="search-empty">No applications found</span>}
                <button className="web-search-result" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank', 'noopener,noreferrer')}><Search size={18} /><span>Search the web for “{searchQuery}”</span></button>
              </div>}
            </div>
          </div>
        )}
        {showNotifications && <div className="notification-center glass-panel"><b>Notifications</b><p>Welcome to Kaalyug OS.</p><p>Tip: press Ctrl/Cmd + K to search.</p><p>Open Yug AI to ask about the portfolio.</p></div>}
        {showTutorial && <div className="tutorial-overlay" onClick={() => setShowTutorial(false)}><div className="tutorial-card glass-panel" onClick={e => e.stopPropagation()}><h2>Welcome to Kaalyug OS</h2><p>Open apps from the dock, use Applications to browse, and search with Ctrl/Cmd + K.</p><button onClick={() => setShowTutorial(false)}>Got it</button></div></div>}
      </div>

      {/* Dock */}
      <div className={`dock-container ${activeWindow ? 'app-active' : ''}`}>
        <div className="dock glass-panel">
          {apps.map(app => {
            const Icon = app.icon;
            const isOpen = openWindows.find(w => w.id === app.id);
            return (
              <div 
                key={app.id} 
                className={`dock-item ${['basic_info', 'projects', 'browser', 'terminal'].includes(app.id) ? 'mobile-essential' : 'mobile-optional'} ${isOpen ? 'is-open' : ''}`}
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
