import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { useEffect, useMemo, useState } from 'react';
import { getOrCreateDeviceId, clearDeviceId } from '../lib/deviceId';

const NS = 'https://authlimiter.example.com/';

function AppPage({ user }) {
  const fullName = useMemo(
    () => user?.[`${NS}full_name`] || user?.name || user?.nickname || user?.email || 'User',
    [user]
  );
  const phoneNumber = useMemo(
    () => user?.[`${NS}phone_number`] || user?.phone_number || null,
    [user]
  );

  const [deviceId, setDeviceId] = useState(null);
  const [activeCount, setActiveCount] = useState(null);
  const [error, setError] = useState(null);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [modalBusy, setModalBusy] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [evictedBanner, setEvictedBanner] = useState(null);

  useEffect(() => {
    const id = getOrCreateDeviceId();
    setDeviceId(id);
    const doLogin = async () => {
      try {
        const r = await fetch('/api/sessions/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_id: id }),
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || 'login failed');

        if (data?.status === 'revoked') {
          clearDeviceId();
          window.location.href = '/logged-out';
          return;
        }
        if (data?.status === 'limit_exceeded') {
          setLimitExceeded(true);
          setActiveSessions(Array.isArray(data.active_sessions) ? data.active_sessions : []);
          return;
        }
        const a = await fetch('/api/sessions/active');
        const ad = await a.json();
        setActiveCount(ad.active_count ?? 0);
      } catch (e) {
        setError(String(e));
      }
    };
    if (id) doLogin();
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
          window.location.href = '/logged-out';
        }
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, [deviceId]);

  return (
    <div className="page-app">
      <>
        <header className="nav">
          <div className="nav-inner container">
            <div className="brand">
              <span className="brand-mark" />
              <span>AuthLimiter</span>
            </div>
            <nav className="nav-links">
              <span className="muted">Hello, {fullName}</span>
              <button className="btn" onClick={() => setShowProfile((s) => !s)}>
                {showProfile ? 'Hide profile' : 'Profile'}
              </button>
              <a className="btn" href="/api/auth/logout">Logout</a>
            </nav>
          </div>
        </header>

        <main className="container" style={{ paddingTop: 24 }}>
          {evictedBanner && (
            <div className="card" style={{ borderColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.08)', marginBottom: 16 }}>
              {evictedBanner}
            </div>
          )}

          <section className="card" style={{ textAlign: 'center', width: '100%', maxWidth: 820, margin: '0 auto' }}>
            <h1 className="title" style={{ marginBottom: 6 }}>Dashboard</h1>
            <p className="muted" style={{ marginTop: 0 }}>
              <span className="status-indicator status-active"></span>
              Device ID: {deviceId || <span className="loading">initializing...</span>}
            </p>
            <p className="kpi">Active devices: {activeCount ?? <span className="loading">...</span>}</p>
            {error && <p style={{ color: 'tomato' }}>{error}</p>}
          </section>

          {showProfile && (
            <section className="card" style={{ marginTop: 18, width: '100%', maxWidth: 820, marginLeft: 'auto', marginRight: 'auto' }}>
              <h2 className="title" style={{ fontSize: 22, marginBottom: 10 }}>Profile</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><strong>Full Name:</strong> <span className="muted">{fullName || '-'}</span></div>
                <div><strong>Phone:</strong> <span className="muted">{phoneNumber || '-'}</span></div>
                <div><strong>Email:</strong> <span className="muted">{user?.email || '-'}</span></div>
                <div><strong>Sub:</strong> <span className="muted">{user?.sub || '-'}</span></div>
              </div>
            </section>
          )}
        </main>

        {limitExceeded && (
          <div className="modal-backdrop">
            <div className="modal">
              <h2 className="title" style={{ fontSize: 22, marginBottom: 12 }}>🚫 Device limit reached</h2>
              <p>You’re signed in on too many devices. Evict one, evict all, or cancel login.</p>
              <div className="list" style={{ marginBottom: 12 }}>
                {activeSessions.length === 0 ? (
                  <p style={{ margin: 0 }}>No sessions found.</p>
                ) : (
                  activeSessions.map((s) => (
                    <div key={s.device_id} className="list-row">
                      <div><code>{s.device_id}</code></div>
                      <button
                        className="btn btn-danger"
                        disabled={modalBusy}
                        onClick={async () => {
                          if (!deviceId) return;
                          setModalBusy(true);
                          try {
                            await fetch('/api/sessions/evict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device_id: s.device_id }) });
                            const retry = await fetch('/api/sessions/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device_id: deviceId }) });
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
              <div className="row" style={{ justifyContent: 'center', gap: 12 }}>
                <button
                  className="btn btn-danger"
                  disabled={modalBusy}
                  onClick={async () => {
                    setModalBusy(true);
                    try {
                      await fetch('/api/sessions/revoke_all', { method: 'POST' });
                      const retry = await fetch('/api/sessions/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device_id: deviceId }) });
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
                  {modalBusy ? '⏳ Processing…' : '🗑️ Evict all'}
                </button>
                <button
                  className="btn"
                  disabled={modalBusy}
                  onClick={async () => {
                    try {
                      await fetch('/api/sessions/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device_id: deviceId }) });
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
      </>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { user } = await getSession(ctx.req, ctx.res);
    return { props: { user } };
  }
});
export default AppPage;
