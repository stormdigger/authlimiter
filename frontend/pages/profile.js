import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useEffect, useState } from 'react';
import { getOrCreateDeviceId, clearDeviceId } from '../lib/deviceId';

export default function Profile({ user }) {
  const [deviceId, setDeviceId] = useState(null);
  const [activeCount, setActiveCount] = useState(null);
  const [error, setError] = useState(null);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [modalBusy, setModalBusy] = useState(false);
  useEffect(() => {
    const id = getOrCreateDeviceId();
    setDeviceId(id);
    const login = async () => {
      try {
        const r = await fetch('/api/sessions/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_id: id }),
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || 'login failed');
        if (data?.status === 'revoked') {
          // This device_id was evicted previously. Clear it and force relogin
          clearDeviceId();
          alert('This device was logged out from another session. Please login again.');
          window.location.href = '/api/auth/logout';
          return;
        }
        if (data?.status === 'limit_exceeded') {
          setLimitExceeded(true);
          setActiveSessions(Array.isArray(data.active_sessions) ? data.active_sessions : []);
          return; // block progressing until user resolves modal
        }
        const a = await fetch('/api/sessions/active');
        const ad = await a.json();
        setActiveCount(ad.active_count ?? 0);
      } catch (e) {
        setError(String(e));
      }
    };
    if (id) login();
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    const interval = setInterval(async () => {
      try {
        const r = await fetch('/api/sessions/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_id: deviceId }),
        });
        const data = await r.json();
        if (data?.revoked) {
          clearDeviceId();
          alert(data?.message || 'You were logged out from another device.');
          window.location.href = '/api/auth/logout';
        }
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, [deviceId]);
  return (
    <main className="container" style={{ position: 'relative' }}>
      <div className="card">
        <h1 className="title gradient-text">Profile</h1>
        <div style={{ marginBottom: '20px' }}>
          <p className="muted">
            <span className="status-indicator status-active"></span>
            Device ID: {deviceId || <span className="loading">initializing...</span>}
          </p>
          <p style={{ fontSize: '18px', fontWeight: '600' }}>
            Active devices: {activeCount !== null ? activeCount : <span className="loading">...</span>}
          </p>
        </div>
        {error && <p style={{ color: 'tomato' }}>{error}</p>}
      {limitExceeded && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="title" style={{ fontSize: '22px', marginBottom: '12px' }}>🚫 Device limit reached</h2>
            <p>You’re signed in on too many devices. Evict one, evict all, or cancel login.</p>
            <div className="list" style={{ marginBottom: 12 }}>
              {activeSessions.length === 0 ? (
                <p style={{ margin: 0 }}>No sessions found.</p>
              ) : (
                activeSessions.map((s) => (
                  <div key={s.device_id} className="list-row">
                    <div>
                      <code>{s.device_id}</code>
                    </div>
                    <button className="btn btn-danger"
                      disabled={modalBusy}
                      onClick={async () => {
                        if (!deviceId) return;
                        setModalBusy(true);
                        try {
                          await fetch('/api/sessions/evict', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ device_id: s.device_id }),
                          });
                          // Retry login for this device
                          const retry = await fetch('/api/sessions/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ device_id: deviceId }),
                          });
                          const retryData = await retry.json();
                          if (retryData?.status === 'limit_exceeded') {
                            setActiveSessions(Array.isArray(retryData.active_sessions) ? retryData.active_sessions : []);
                          } else {
                            setLimitExceeded(false);
                            const a = await fetch('/api/sessions/active');
                            const ad = await a.json();
                            setActiveCount(ad.active_count ?? 0);
                          }
                        } catch (e) {
                          setError(String(e));
                        } finally {
                          setModalBusy(false);
                        }
                      }}
                    >
                      {modalBusy ? '⏳ Please wait…' : '🗑️ Evict'}
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="row" style={{ justifyContent: 'center', gap: '12px' }}>
              <button className="btn btn-danger"
                disabled={modalBusy}
                onClick={async () => {
                  setModalBusy(true);
                  try {
                    await fetch('/api/sessions/revoke_all', { method: 'POST' });
                    const retry = await fetch('/api/sessions/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ device_id: deviceId }),
                    });
                    const retryData = await retry.json();
                    if (retryData?.status === 'limit_exceeded') {
                      setActiveSessions(Array.isArray(retryData.active_sessions) ? retryData.active_sessions : []);
                    } else {
                      setLimitExceeded(false);
                      const a = await fetch('/api/sessions/active');
                      const ad = await a.json();
                      setActiveCount(ad.active_count ?? 0);
                    }
                  } catch (e) {
                    setError(String(e));
                  } finally {
                    setModalBusy(false);
                  }
                }}
              >
                {modalBusy ? '⏳ Please wait…' : '🗑️ Evict all'}
              </button>
              <button className="btn"
                disabled={modalBusy}
                onClick={async () => {
                  try {
                    await fetch('/api/sessions/logout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ device_id: deviceId }),
                    });
                  } catch {}
                  clearDeviceId();
                  window.location.href = '/api/auth/logout';
                }}
              >
                ❌ Cancel login
              </button>
            </div>
          </div>
        </div>
      )}
      <p>
        <button className="btn"
          onClick={async () => {
            try {
              await fetch('/api/sessions/revoke_all', { method: 'POST' });
              const a = await fetch('/api/sessions/active');
              const ad = await a.json();
              setActiveCount(ad.active_count ?? 0);
            } catch {}
          }}
        >
          Revoke all sessions
        </button>
      </p>
      <p>
        <a className="link"
          href="#"
          onClick={async (e) => {
            e.preventDefault();
            try {
              await fetch('/api/sessions/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device_id: deviceId }),
              });
            } catch {}
            window.location.href = '/api/auth/logout';
          }}
        >
          Logout
        </a>
      </p>
      </div>
    </main>
  );
}

export const getServerSideProps = withPageAuthRequired();


