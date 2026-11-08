import { useState, useEffect } from 'react';
import { Menu, Wand2, MessageSquare } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MouseTracker from './components/MouseTracker';
import ChatView from './components/ChatView';
import AdminPanel from './components/AdminPanel';

import DocumentManager from './components/DocumentManager';
import EmailManager from './components/EmailManager';
import NotesTasksManager from './components/NotesTasksManager';
import CalendarManager from './components/CalendarManager';
import SettingsView from './components/SettingsView';
import MCPServers from './components/MCPServers';
import CompareView from './components/CompareView';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import ResetPasswordView from './components/ResetPasswordView';
import StudioView from './components/StudioView';
import CommandPalette from './components/CommandPalette';

function LogoutView() {
  return (
    <div className="app-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="app-container fade-in" style={{ maxWidth: '500px', height: 'auto', padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <svg className="handwriting-svg" viewBox="0 0 400 100" style={{ width: '200px', height: 'auto', marginBottom: '10px' }}>
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="handwriting-text">
            Rumii.AI
          </text>
        </svg>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Thanks for using our AI!</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          You have been successfully logged out of your session. We hope to see you again soon.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            marginTop: '10px', width: '100%', padding: '14px', background: 'var(--accent-color)', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'chat';
  });
  const [user, setUser] = useState({ username: 'Loading...' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(
    window.location.pathname === '/login' || 
    window.location.pathname === '/logout-success' || 
    window.location.pathname === '/reset-password'
  );
  const [theme, setTheme] = useState('light');
  const [showStartup, setShowStartup] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chatTitle, setChatTitle] = useState('Chat');

  const [greetingIndex, setGreetingIndex] = useState(0);
  const greetings = ['hello', 'hola', 'bonjour', 'Rumii.AI'];

  useEffect(() => {
    if (!showStartup) return;
    
    // Cycle through greetings every 1.5s (matches appleHello animation duration)
    const cycleInterval = setInterval(() => {
      setGreetingIndex((prev) => {
        if (prev === greetings.length - 1) {
          clearInterval(cycleInterval);
          setTimeout(() => setShowStartup(false), 2000); // Wait for handwriting to finish then hide overlay
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(cycleInterval);
  }, [showStartup, greetings.length]);

  useEffect(() => {
    window.location.hash = activeView;
  }, [activeView]);

  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
  }, []);

  useEffect(() => {
    const handleViewChange = (e) => {
      setActiveView(e.detail);
      if (e.detail === 'chat') {
        setChatTitle('New Chat'); // or keep it 'Chat', we'll update it when session loads
      }
    };

    const handleTitleUpdate = (e) => {
      if (activeView === 'chat') {
        setChatTitle(e.detail.title || 'Chat');
      }
    };

    window.addEventListener('changeView', handleViewChange);
    window.addEventListener('chatTitleUpdated', handleTitleUpdate);
    return () => {
      window.removeEventListener('changeView', handleViewChange);
      window.removeEventListener('chatTitleUpdated', handleTitleUpdate);
    };
  }, [activeView]);

  const enterGuestMode = async () => {
    try {
      const res = await fetch('/auth/guest', { method: 'POST' });
      if (res.ok) {
        const guestData = await res.json();
        setUser(guestData);
        window.wsToken = guestData.ws_token;
        setIsAuthenticated(true);
        setActiveView('chat');
        return true;
      }
    } catch (e) {
      console.warn('Guest login error:', e);
    }
    return false;
  };

  useEffect(() => {
    if (window.location.pathname === '/login' || window.location.pathname === '/logout-success' || window.location.pathname === '/reset-password') {
      return;
    }

    fetch('/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        if (data && data.username) {
          setUser(data);
          window.wsToken = data.ws_token;
          setIsAuthenticated(true);
        } else {
          return enterGuestMode().then(ok => {
            if (!ok) window.location.href = '/login';
          });
        }
      })
      .catch(() => {
        return enterGuestMode().then(ok => {
          if (!ok) window.location.href = '/login';
        });
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  if (window.location.pathname === '/login') {
    return <LoginView />;
  }

  if (window.location.pathname === '/reset-password') {
    return <ResetPasswordView />;
  }

  if (window.location.pathname === '/logout-success') {
    return <LogoutView />;
  }

  if (!authChecked || !isAuthenticated) {
    return (
      <div className="app-wrapper">
        <div className="startup-overlay">
          <div className="hello-text">
            <svg className="handwriting-svg" viewBox="0 0 400 100">
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan className="handwriting-text-cursive">Rumii</tspan>
                <tspan className="handwriting-text-sans" dx="2" dy="-3" opacity="0.85">.AI</tspan>
              </text>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const toggleTheme = () => {
    // Theme is locked to light mode
  };

  return (
    <div className="app-wrapper">
      {showStartup && (
        <div className={`startup-overlay ${greetingIndex === greetings.length - 1 && !showStartup ? 'fade-out' : ''}`}>
          <div key={greetingIndex} className="hello-text" style={greetingIndex === greetings.length - 1 ? { animation: 'none', opacity: 1 } : {}}>
            {greetingIndex === greetings.length - 1 ? (
              <svg className="handwriting-svg" viewBox="0 0 400 100">
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                  <tspan className="handwriting-text-cursive">Rumii</tspan>
                  <tspan className="handwriting-text-sans" dx="2" dy="-3" opacity="0.85">.AI</tspan>
                </text>
              </svg>
            ) : (
              greetings[greetingIndex]
            )}
          </div>
        </div>
      )}

      <MouseTracker />
      <div className="app-container fade-in">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          user={user}
          toggleTheme={toggleTheme}
          theme={theme}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        <main className="main-content" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </button>

          {activeView !== 'documents' && activeView !== 'email' && activeView !== 'notes' && activeView !== 'calendar' && activeView !== 'settings' && activeView !== 'scheduled-tasks' && activeView !== 'api-keys' && activeView !== 'compare' && activeView !== 'profile' && activeView !== 'admin' && (
            <header className="chat-header" style={{ position: 'relative' }}>
              <div className="chat-header-title-container" style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
                <h2 key={chatTitle} className="animate-fade-in chat-header-title" style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeView === 'chat' ? chatTitle : activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                </h2>
              </div>
              
              {(activeView === 'chat' || activeView === 'studio') && (
                <div className="chat-header-segmented-container" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', zIndex: 10 }}>
                  <div className="segmented-control">
                    <div 
                      className={`segment-indicator ${activeView === 'studio' ? 'studio' : 'chat'}`} 
                      style={{
                        transform: activeView === 'studio' ? 'translateX(100%)' : 'translateX(0)',
                        width: '50%'
                      }}
                    />
                    <button 
                      className={`segment-btn ${activeView === 'chat' ? 'active chat' : ''}`}
                      onClick={() => setActiveView('chat')}
                      style={{ width: '100px' }}
                    >
                      <MessageSquare size={16} /> Chat
                    </button>
                    <button 
                      className={`segment-btn ${activeView === 'studio' ? 'active studio' : ''}`}
                      onClick={() => setActiveView('studio')}
                      style={{ width: '100px' }}
                    >
                      <Wand2 size={16} /> Studio
                    </button>
                  </div>
                </div>
              )}
              
              <div style={{ flex: 1 }}></div>
            </header>
          )}

          <div className="view-transition" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: activeView === 'chat' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <ChatView activeView={activeView} setActiveView={setActiveView} user={user} />
            </div>
            <div style={{ display: activeView === 'research' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <ChatView isResearch={true} activeView={activeView} setActiveView={setActiveView} user={user} />
            </div>
            <div style={{ display: activeView === 'documents' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <DocumentManager user={user} />
            </div>
            <div style={{ display: activeView === 'email' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <EmailManager user={user} />
            </div>
            <div style={{ display: activeView === 'notes' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <NotesTasksManager user={user} />
            </div>
            <div style={{ display: activeView === 'calendar' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <CalendarManager user={user} />
            </div>
            <div style={{ display: (activeView === 'settings' || activeView === 'api-keys') ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <SettingsView user={user} initialTab={activeView === 'api-keys' ? 'api-keys' : 'api-keys'} />
            </div>
            <div style={{ display: activeView === 'profile' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <ProfileView user={user} setUser={setUser} setActiveView={setActiveView} />
            </div>
            <div style={{ display: activeView === 'compare' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <CompareView />
            </div>
            <div style={{ display: activeView === 'admin' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <AdminPanel user={user} />
            </div>
            <div style={{ display: activeView === 'mcp-servers' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <MCPServers />
            </div>
            <div style={{ display: activeView === 'studio' ? 'flex' : 'none', flex: 1, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
              <StudioView />
            </div>
          </div>
        </main>
      </div>
      <CommandPalette activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}

export default App;
