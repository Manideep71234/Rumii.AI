import { useState } from 'react';
import { Key, Clock, Shield, Download, CheckCircle2, Sparkles, Database, RefreshCw } from 'lucide-react';
import SettingsAPIKeys from './SettingsAPIKeys';
import SettingsScheduledTasks from './SettingsScheduledTasks';

export default function SettingsView({ user, initialTab = 'api-keys' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const isGuest = Boolean(user && (user.auth_provider === 'guest' || user.is_guest));

  const handleExportData = async () => {
    setIsExporting(true);
    setExportStatus('');
    try {
      const res = await fetch('/settings/export-data');
      if (!res.ok) throw new Error('Failed to export data');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rumii_export_${user?.username || 'user'}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setExportStatus('Export downloaded successfully!');
      setTimeout(() => setExportStatus(''), 4000);
    } catch (err) {
      setExportStatus('Failed to download export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Clear local browser workspace cache? This will refresh your session.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="view-container fade-in" style={{ padding: '2rem', overflowY: 'auto', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Settings Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Settings
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Manage your AI model API keys, background agent automations, and workspace data.
        </p>
      </div>

      {/* Tabs navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--panel-border)',
        marginBottom: '2rem',
        paddingBottom: '4px'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('api-keys')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: activeTab === 'api-keys' ? 'var(--accent-color)' : 'transparent',
            color: activeTab === 'api-keys' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Key size={16} /> API Keys & Models
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('agents')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: activeTab === 'agents' ? 'var(--accent-color)' : 'transparent',
            color: activeTab === 'agents' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Clock size={16} /> Scheduled Agents
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('data')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: activeTab === 'data' ? 'var(--accent-color)' : 'transparent',
            color: activeTab === 'data' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Database size={16} /> Data & Privacy
        </button>
      </div>

      {/* Tab 1: API Keys & Providers */}
      {activeTab === 'api-keys' && (
        <div className="fade-in">
          {/* Guest Mode Info Callout */}
          {isGuest && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px 20px',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              color: 'var(--text-primary)'
            }}>
              <Sparkles size={20} style={{ color: 'var(--accent-color)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '4px' }}>
                  Guest Mode Active
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  You are currently using shared cloud models. To use your personal custom API keys or keep your keys permanently saved across devices, you can save your keys below or <a href="/login" style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}>Sign In / Register</a>.
                </div>
              </div>
            </div>
          )}

          <div style={{
            background: 'var(--panel-bg)',
            border: '1px solid var(--panel-border)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <SettingsAPIKeys />
          </div>
        </div>
      )}

      {/* Tab 2: Scheduled Agents */}
      {activeTab === 'agents' && (
        <div className="fade-in">
          <div style={{
            background: 'var(--panel-bg)',
            border: '1px solid var(--panel-border)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Automated Background Agents
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                Schedule autonomous recurring prompt executions that run on a cron timer in the background.
              </p>
            </div>
            <SettingsScheduledTasks user={user} />
          </div>
        </div>
      )}

      {/* Tab 3: Data & Privacy */}
      {activeTab === 'data' && (
        <div className="fade-in">
          <div style={{
            background: 'var(--panel-bg)',
            border: '1px solid var(--panel-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Export Workspace Data
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                Download an encrypted archive containing all your chats, documents, notes, and tasks in standard JSON format.
              </p>
              
              <button
                type="button"
                onClick={handleExportData}
                disabled={isExporting}
                className="glass-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: 'var(--accent-color)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  opacity: isExporting ? 0.6 : 1
                }}
              >
                <Download size={16} />
                {isExporting ? 'Preparing Archive...' : 'Download My Data (.zip)'}
              </button>

              {exportStatus && (
                <div style={{ marginTop: '10px', fontSize: '0.85rem', color: exportStatus.includes('success') ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {exportStatus.includes('success') && <CheckCircle2 size={14} />}
                  {exportStatus}
                </div>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--panel-border)' }} />

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Browser Cache & Reset
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                Clear local cached state, theme cookies, and UI preferences stored in your browser.
              </p>

              <button
                type="button"
                onClick={handleClearCache}
                className="glass-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} /> Clear Local Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
