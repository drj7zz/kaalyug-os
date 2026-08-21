import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import './Window.css';
import { X, Minus, Plus, ExternalLink, MapPin, Briefcase, Award, User, HelpCircle, MessageSquare, ShieldCheck, Clock, Code, Globe, Folder, FolderOpen, Grid2X2, ChevronLeft, Terminal as TerminalIcon, ArrowRight, Mail, Settings } from 'lucide-react';

// Custom SVG Icons for GitHub, Instagram, and Gmail
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const GmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052c1.618-1.214 3.927-.059 3.927 1.964z"/>
  </svg>
);

const Window = ({ app, isActive, onFocus, onClose, onMinimize, isMinimized, theme, setTheme, onOpenApp }) => {
  const isMobile = window.innerWidth <= 768;
  const desktopWidth = Math.min(640, window.innerWidth - 48);
  const desktopHeight = Math.min(480, window.innerHeight - 76);
  const [isFullScreen, setIsFullScreen] = useState(isMobile);
  const [browserUrl, setBrowserUrl] = useState('https://github.com/drj7zz');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState(['Kaalyug Terminal v0.1.1', 'Type "help" to see available commands.']);
  const [finderQuery, setFinderQuery] = useState('');
  const [finderDirectory, setFinderDirectory] = useState('Root');
  const [aiMessages, setAiMessages] = useState([{ role: 'ai', text: 'Hi, I’m Yug AI. Ask me about Dirghraj, his projects, skills, or contact details.' }]);
  const [aiContext, setAiContext] = useState('');
  const [messageUser, setMessageUser] = useState(localStorage.getItem('kaalyug_message_user') || '');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [githubStats, setGithubStats] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);

  useEffect(() => {
    if (app.id !== 'yug_ai') return;
    fetch('/context.txt').then(response => response.ok ? response.text() : '').then(setAiContext).catch(() => setAiContext('Portfolio context is currently unavailable.'));
  }, [app.id]);

  useEffect(() => {
    if (app.id !== 'analytics') return;
    Promise.all([fetch('https://api.github.com/users/drj7zz').then(r => r.ok ? r.json() : null), fetch('https://api.github.com/users/drj7zz/repos?sort=updated&per_page=6').then(r => r.ok ? r.json() : [])]).then(([profile, repos]) => { setGithubStats(profile); setGithubRepos(Array.isArray(repos) ? repos : []); }).catch(() => { setGithubStats(null); setGithubRepos([]); });
  }, [app.id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && !isFullScreen) {
        setIsFullScreen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullScreen]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const openPopupLink = (url) => {
    window.open(url, '_blank', 'width=1000,height=700,scrollbars=yes,resizable=yes');
  };

  const renderContent = () => {
    switch(app.id) {
      case 'basic_info':
        return (
          <div className="portfolio-content profile-page">
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); e.currentTarget.reset(); alert('Thanks! Your message is ready to send via email.'); }}><input required name="name" placeholder="Your name" /><input required type="email" name="email" placeholder="Your email" /><textarea required name="message" placeholder="Your message" rows="4" /><button type="submit">Send message</button></form>
            <div className="profile-header-card">
              <img src="/drj1.jpg" alt="Dirghraj Giri" className="profile-avatar-large" loading="eager" decoding="sync" />
              <div className="profile-header-info">
                <h1>Dirghraj Giri</h1>
                <p className="subtitle">Frontend Developer from <b>Madhesh, Nepal</b></p>
                <div className="location-badge">
                  <MapPin size={14} /> Madhesh, Nepal
                </div>
              </div>
            </div>

            <div className="info-card bio-card">
              <h3><User size={18} /> About Me</h3>
              <p>
                I'm a self-taught frontend developer from <b>Madhesh, Nepal</b>, building real products — not tutorials. 
                I work at the intersection of clean UI and systems that actually need to work: wallets that handle transaction 
                history correctly, review platforms with real business logic, and compliance tools built for actual institutions.
              </p>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <h3><Code size={18} /> Core Skills</h3>
                <ul className="pill-list">
                  <li className="tech-pill">React</li>
                  <li className="tech-pill">JavaScript</li>
                  <li className="tech-pill">HTML5 & CSS3</li>
                  <li className="tech-pill">UI/UX Design</li>
                  <li className="tech-pill">Glassmorphism</li>
                </ul>
              </div>

              <div className="info-card">
                <h3><Award size={18} /> Highlights</h3>
                <ul className="simple-list">
                  <li>Building wallets, trackers, & review platforms</li>
                  <li>Open Source Contributor</li>
                  <li>Always learning, always building</li>
                </ul>
              </div>
            </div>

            <div className="info-card links-card">
              <h3>Direct Links</h3>
              <div className="social-links-list">
                <div className="social-link-row" onClick={() => openPopupLink('https://github.com/drj7zz')}>
                  <div className="social-icon-box github-bg"><GithubIcon /></div>
                  <div className="social-link-info">
                    <span className="social-name">GitHub</span>
                    <span className="social-handle">github.com/drj7zz</span>
                  </div>
                  <ExternalLink size={14} className="social-arrow" />
                </div>

                <div className="social-link-row" onClick={() => openPopupLink('https://www.instagram.com/drj7zz')}>
                  <div className="social-icon-box instagram-bg"><InstagramIcon /></div>
                  <div className="social-link-info">
                    <span className="social-name">Instagram</span>
                    <span className="social-handle">@drj7zz</span>
                  </div>
                  <ExternalLink size={14} className="social-arrow" />
                </div>

                <div className="social-link-row" onClick={() => openPopupLink('mailto:giridirghraj@gmail.com')}>
                  <div className="social-icon-box gmail-bg"><GmailIcon /></div>
                  <div className="social-link-info">
                    <span className="social-name">Email</span>
                    <span className="social-handle">giridirghraj@gmail.com</span>
                  </div>
                  <ExternalLink size={14} className="social-arrow" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="portfolio-content projects-page">
            <h2 className="section-title"><Briefcase size={22} /> Featured Projects</h2>
            <div className="projects-grid">
              <div className="project-card">
                <div className="project-card-header">
                  <h3>YugCoin Wallet</h3>
                  <span className="status-badge">Active</span>
                </div>
                <p>
                  A next-generation crypto wallet and transaction history manager designed with 
                  bulletproof state management and real-time ledger tracking.
                </p>
                <div className="project-tags">
                  <span>React</span><span>Crypto</span><span>Fintech</span>
                </div>
                <div className="social-link-row inline-project-link" onClick={() => openPopupLink('https://github.com/drj7zz')}>
                  <div className="social-icon-box github-bg small-box"><GithubIcon /></div>
                  <span className="social-name">View Repository</span>
                  <ExternalLink size={14} className="social-arrow" />
                </div>
              </div>

              <div className="project-card">
                <div className="project-card-header">
                  <h3>Review & Compliance Platform</h3>
                  <span className="status-badge">In Production</span>
                </div>
                <p>
                  Institutional review platform handling complex business logic, audit trails, 
                  and compliance workflows for organizations.
                </p>
                <div className="project-tags">
                  <span>Web App</span><span>Compliance</span><span>UI Architecture</span>
                </div>
                <div className="social-link-row inline-project-link" onClick={() => openPopupLink('https://github.com/drj7zz')}>
                  <div className="social-icon-box github-bg small-box"><GithubIcon /></div>
                  <span className="social-name">View Repository</span>
                  <ExternalLink size={14} className="social-arrow" />
                </div>
              </div>

              <div className="project-card">
                <div className="project-card-header">
                  <h3>Financial Tracker & Analytics</h3>
                  <span className="status-badge">Completed</span>
                </div>
                <p>
                  High-performance financial tracker designed for institution-grade metrics, 
                  data visualization, and account auditing.
                </p>
                <div className="project-tags">
                  <span>Dashboard</span><span>Analytics</span><span>Vanilla CSS</span>
                </div>
                <div className="social-link-row inline-project-link" onClick={() => openPopupLink('https://github.com/drj7zz')}>
                  <div className="social-icon-box github-bg small-box"><GithubIcon /></div>
                  <span className="social-name">View Repository</span>
                  <ExternalLink size={14} className="social-arrow" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="portfolio-content contact-page">
            <h2 className="section-title">Contact Dirghraj Giri</h2>
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); e.currentTarget.reset(); alert('Thanks! Your message is ready to send via email.'); }}><input required name="name" placeholder="Your name" /><input required type="email" name="email" placeholder="Your email" /><textarea required name="message" placeholder="Your message" rows="4" /><button type="submit">Send message</button></form>
            <div className="info-card">
              <p style={{ marginBottom: '16px' }}>Feel free to reach out for collaborations, projects, or inquiries:</p>
              
              <div className="social-links-list">
                <div className="social-link-row" onClick={() => openPopupLink('mailto:giridirghraj@gmail.com')}>
                  <div className="social-icon-box gmail-bg"><GmailIcon /></div>
                  <div className="social-link-info">
                    <span className="social-name">Email</span>
                    <span className="social-handle">giridirghraj@gmail.com</span>
                  </div>
                  <ExternalLink size={14} className="social-arrow" />
                </div>

                <div className="social-link-row" onClick={() => openPopupLink('https://github.com/drj7zz')}>
                  <div className="social-icon-box github-bg"><GithubIcon /></div>
                  <div className="social-link-info">
                    <span className="social-name">GitHub</span>
                    <span className="social-handle">github.com/drj7zz</span>
                  </div>
                  <ExternalLink size={14} className="social-arrow" />
                </div>

                <div className="social-link-row" onClick={() => openPopupLink('https://www.instagram.com/drj7zz')}>
                  <div className="social-icon-box instagram-bg"><InstagramIcon /></div>
                  <div className="social-link-info">
                    <span className="social-name">Instagram</span>
                    <span className="social-handle">@drj7zz</span>
                  </div>
                  <ExternalLink size={14} className="social-arrow" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="portfolio-content support-page">
            <h2 className="section-title"><HelpCircle size={22} color="#FF3B30" /> Customer Care & Support</h2>
            
            <div className="info-card">
              <h3><ShieldCheck size={18} color="#30D158" /> Kaalyug OS Help Desk</h3>
              <p>Have an inquiry, technical issue, or feedback regarding Kaalyug OS or custom development services?</p>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <h3><Clock size={18} /> Response Time</h3>
                <p>Typically responds within 24 hours.</p>
                <span className="status-badge" style={{ marginTop: '8px', display: 'inline-block' }}>Online</span>
              </div>

              <div className="info-card">
                <h3><MessageSquare size={18} /> Direct Line</h3>
                <p>Madhesh, Nepal Support Center</p>
                <p><b>giridirghraj@gmail.com</b></p>
              </div>
            </div>

            <div className="info-card">
              <h3>Support Actions</h3>
              <div className="social-links-list">
                <div className="social-link-row" onClick={() => openPopupLink('mailto:giridirghraj@gmail.com?subject=Kaalyug%20OS%20Support%20Inquiry')}>
                  <div className="social-icon-box gmail-bg"><GmailIcon /></div>
                  <div className="social-link-info">
                    <span className="social-name">Send Email Support Ticket</span>
                    <span className="social-handle">giridirghraj@gmail.com</span>
                  </div>
                  <ExternalLink size={14} className="social-arrow" />
                </div>

                <div className="social-link-row" onClick={() => openPopupLink('https://github.com/drj7zz/drj7zz/issues')}>
                  <div className="social-icon-box github-bg"><GithubIcon /></div>
                  <div className="social-link-info">
                    <span className="social-name">Report Issue on GitHub</span>
                    <span className="social-handle">github.com/drj7zz</span>
                  </div>
                  <ExternalLink size={14} className="social-arrow" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="portfolio-content settings-app">
            <h2>Appearance Settings</h2>
            <p>Customize the look and theme of Kaalyug OS:</p>
            <div className="theme-options">
              <button className={theme === 'dark' ? 'active-theme' : ''} onClick={() => setTheme('dark')}>Dark Mode (Default)</button>
              <button className={theme === 'blue' ? 'active-theme' : ''} onClick={() => setTheme('blue')}>Blue Theme</button>
              <button className={theme === 'pink' ? 'active-theme' : ''} onClick={() => setTheme('pink')}>Pink Theme</button>
            </div>
          </div>
        );

      case 'browser':
        return (
          <div className="utility-app browser-app">
            <form className="browser-toolbar" onSubmit={(e) => { e.preventDefault(); const value = e.currentTarget.elements.url.value.trim(); setBrowserUrl(value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`); }}>
              <Globe size={17} />
              <input name="url" value={browserUrl} onChange={(e) => setBrowserUrl(e.target.value)} aria-label="Browser URL" />
              <button type="submit"><ArrowRight size={16} /></button>
            </form>
            <iframe className="browser-frame" src={browserUrl} title="Kaalyug Browser" />
            <div className="browser-note">Some sites block embedded browsing. Use the button if the page is unavailable.</div>
            <button className="browser-open-button" onClick={() => window.open(browserUrl, '_blank', 'noopener,noreferrer')}>Open in new tab</button>
          </div>
        );

      case 'terminal':
        return (
          <div className="utility-app terminal-app">
            <div className="terminal-output">{terminalOutput.map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}</div>
            <form className="terminal-form" onSubmit={(e) => {
              e.preventDefault();
              const command = terminalInput.trim();
              if (!command) return;
              const result = command === 'help' ? 'Commands: help, about, projects, contact, open browser, open finder, date, clear, matrix, neofetch' : command === 'matrix' ? 'Wake up, portfolio... The Matrix has you.' : command === 'neofetch' ? 'Kaalyug OS | React | v0.1.1 | Madhesh, Nepal' : command === 'about' ? 'Yug AI: Ask me anything about Dirghraj, his skills, projects, or contact details.' : command === 'projects' ? 'YugCoin Wallet | Review & Compliance Platform | Financial Tracker' : command === 'contact' ? 'giridirghraj@gmail.com' : command === 'date' ? new Date().toString() : command === 'clear' ? '' : command.startsWith('open ') ? `Opening ${command.slice(5)}...` : `Command not found: ${command}`;
              setTerminalOutput(prev => command === 'clear' ? [] : [...prev, `guest@kaalyug:~$ ${command}`, result]);
              setTerminalInput('');
            }}>
              <span>guest@kaalyug:~$</span><input value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} autoFocus aria-label="Terminal command" />
            </form>
          </div>
        );

      case 'analytics':
        return <div className="utility-app analytics-app"><h2>GitHub Analytics</h2><p>Live public profile data for <b>drj7zz</b>.</p><div className="analytics-card">{githubStats ? <><b>{githubStats.name || 'Dirghraj Giri'}</b><span>Repositories: {githubStats.public_repos}</span><span>Followers: {githubStats.followers}</span><span>Following: {githubStats.following}</span></> : <span>Loading GitHub stats or API unavailable.</span>}</div><div className="repo-list">{githubRepos.map(repo => <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"><b>{repo.name}</b><span>{repo.description || 'No description available.'}</span><small>★ {repo.stargazers_count} · Updated {new Date(repo.updated_at).toLocaleDateString()}</small></a>)}</div><button className="browser-open-button" onClick={() => window.open('https://github.com/drj7zz', '_blank', 'noopener,noreferrer')}>Open GitHub profile</button></div>;

      case 'messages':
        return <div className="utility-app messages-app"><h2>Messages</h2>{!messageUser ? <form className="message-login" onSubmit={(e) => { e.preventDefault(); const name = e.currentTarget.elements.username.value.trim(); if (name) { localStorage.setItem('kaalyug_message_user', name); setMessageUser(name); } }}><p>Sign in with a username to continue.</p><input name="username" required minLength="2" placeholder="Username" /><button type="submit">Continue</button></form> : <><p className="message-user">Signed in as <b>{messageUser}</b></p><div className="message-list">{messages.map((msg, i) => <div key={i} className="message-bubble"><b>{msg.user}</b><span>{msg.text}</span></div>)}</div><form className="message-compose" onSubmit={async (e) => { e.preventDefault(); if (!messageText.trim()) return; const msg = { user: messageUser, text: messageText.trim() }; setMessages(prev => [...prev, msg]); setMessageText(''); const api = import.meta.env.VITE_API_BASE_URL; if (api) fetch(`${api}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg) }).catch(() => {}); }}><input value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Write a message..." /><button type="submit">Send</button></form></>}</div>;

      case 'finder':
        const finderItems = ['About Me', 'Projects', 'Contact', 'Settings', 'Browser', 'Terminal', 'Yug AI'];
        return (
          <div className="utility-app finder-app">
            <div className="finder-toolbar"><FolderOpen size={18} /> <b>Finder</b><span className="finder-path">Kaalyug OS / Applications</span><input className="finder-search" placeholder="Search" value={finderQuery} onChange={(e) => setFinderQuery(e.target.value)} /></div>
            <div className="finder-layout"><aside className="finder-sidebar"><b>Favorites</b>{['Applications', 'Desktop', 'Documents', 'Downloads', 'Pictures'].map(item => <button key={item} onClick={() => setFinderQuery(item === 'Applications' ? '' : item)}><Folder size={16} />{item}</button>)}</aside><div className="finder-table"><div className="finder-table-head"><span>Name</span><span>Kind</span><span>Size</span></div>
              {finderItems.filter(item => item.toLowerCase().includes(finderQuery.toLowerCase())).map(item => { const id = { 'About Me': 'basic_info', Projects: 'projects', Contact: 'contact', Settings: 'settings', Browser: 'browser', Terminal: 'terminal', 'Yug AI': 'yug_ai' }[item]; const Icon = { basic_info: User, projects: Briefcase, contact: Mail, settings: Settings, browser: Globe, terminal: TerminalIcon, yug_ai: MessageSquare }[id]; return <button key={item} className="finder-file-row" onClick={() => onOpenApp?.({ id, title: item })}><span><Icon size={18} /><b>{item}</b></span><span>Application</span><span>—</span></button>; })}</div></div>
          </div>
        );

      case 'yug_ai':
        return (
          <div className="utility-app ai-app"><h2>Yug AI</h2><div className="ai-messages">{aiMessages.map((message, index) => <div key={index} className={`ai-message ${message.role}`}>{message.text}</div>)}</div><form className="ai-form" onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.elements.question; const question = input.value.trim(); if (!question) return; const lower = question.toLowerCase(); const answer = lower.includes('project') ? (aiContext.match(/PROJECTS: (.*)/)?.[1] || 'Project information is unavailable.') : lower.includes('skill') ? (aiContext.match(/SKILLS: (.*)/)?.[1] || 'Skills information is unavailable.') : lower.includes('contact') || lower.includes('email') ? (aiContext.match(/EMAIL: (.*)/)?.[1] || 'Contact information is unavailable.') : `I’m Yug AI. I can answer from the loaded portfolio context:\n\n${aiContext || 'Loading context...'}`; setAiMessages(prev => [...prev, { role: 'user', text: question }, { role: 'ai', text: answer }]); input.value = ''; }}><input name="question" placeholder="Ask Yug AI..." /><button type="submit"><ArrowRight size={16} /></button></form></div>
        );

      case 'applications':
        return <div className="utility-app applications-app"><div className="finder-toolbar"><Grid2X2 size={18} /><b>Applications</b></div><div className="application-drawer-grid">{['About Me', 'Projects', 'Contact', 'Settings', 'Browser', 'Terminal', 'Yug AI'].map(item => { const id = { 'About Me': 'basic_info', Projects: 'projects', Contact: 'contact', Settings: 'settings', Browser: 'browser', Terminal: 'terminal', 'Yug AI': 'yug_ai' }[item]; const Icon = { basic_info: User, projects: Briefcase, contact: Mail, settings: Settings, browser: Globe, terminal: TerminalIcon, yug_ai: MessageSquare }[id]; return <button key={item} className="application-drawer-item" onClick={() => onOpenApp?.({ id, title: item })}><span className={`application-drawer-icon icon-${id}`}><Icon size={28} /></span><span>{item}</span></button>; })}</div></div>;


      default:
        return <div>Content</div>;
    }
  };

  return (
    <Rnd
      default={{
        x: isMobile ? 0 : Math.max(24, (window.innerWidth - desktopWidth) / 2),
        y: isMobile ? 0 : Math.max(12, (window.innerHeight - desktopHeight) / 2),
        width: isMobile ? '100%' : desktopWidth,
        height: isMobile ? '100%' : desktopHeight,
      }}
      size={isFullScreen ? { width: '100%', height: '100%' } : undefined}
      position={isFullScreen ? { x: 0, y: 0 } : undefined}
      minWidth={320}
      minHeight={250}
      bounds=".workspace"
      dragHandleClassName="window-header"
      onMouseDown={onFocus}
      disableDragging={isFullScreen}
      enableResizing={!isFullScreen}
      style={{ zIndex: isActive ? 100 : 10, display: isMinimized ? 'none' : undefined }}
      className={`glass-window ${isActive ? 'active' : ''} ${isFullScreen ? 'fullscreen' : ''}`}
    >
      <div className="window-inner">
        <div className="window-header" onDoubleClick={toggleFullScreen}>
          <div className="window-controls">
            <button className="control-btn close" onClick={(e) => { e.stopPropagation(); onClose(); }} title="Close">
              <X size={8} strokeWidth={3} />
            </button>
            <button className="control-btn minimize" onClick={(e) => { e.stopPropagation(); if (onMinimize) onMinimize(); }} title="Minimize">
              <Minus size={8} strokeWidth={3} />
            </button>
            <button className="control-btn maximize" onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }} title="Maximize">
              <Plus size={8} strokeWidth={3} />
            </button>
          </div>
          <div className="window-title">{app.title}</div>
          <div className="window-spacer"></div>
        </div>
        <div className="window-content">
          {renderContent()}
        </div>
      </div>
    </Rnd>
  );
};

export default Window;
