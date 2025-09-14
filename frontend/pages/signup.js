import { useState } from 'react';

function Brand() {
  return (
    <a href="/" className="sf-brand" aria-label="AuthLimiter Home">
      <span className="sf-brand-mark" />
      <span className="sf-brand-text">AuthLimiter</span>
    </a>
  );
}

export default function Signup() {
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null); setMsg(null);
    try {
      const r = await fetch('/api/auth/custom-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.message || 'Signup failed');
      setMsg('Account created. Redirecting to login…');
      setTimeout(() => { window.location.href = '/api/auth/login?returnTo=%2Fapp'; }, 800);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sf-login-root">
      <div className="sf-box-root sf-flex sf-flex-col" style={{ minHeight: '100vh', flexGrow: 1 }}>
        <div className="sf-loginbackground sf-box-bg-white sf-pt-64">
          <div className="sf-loginbackground-grid">
            <div className="sf-flex" style={{ gridArea: 'top / start / 8 / end' }}>
              <div className="sf-box-root" style={{ backgroundImage: 'linear-gradient(white 0%, rgb(247, 250, 252) 33%)', flexGrow: 1 }} />
            </div>
            <div className="sf-flex" style={{ gridArea: '4 / 2 / auto / 5' }}>
              <div className="sf-box-root sf-box-divider-light-all-2 sf-anim-left-right sf-tans3s" style={{ flexGrow: 1 }} />
            </div>
            <div className="sf-flex" style={{ gridArea: '6 / start / auto / 2' }}>
              <div className="sf-box-root sf-bg-blue800" style={{ flexGrow: 1 }} />
            </div>
            <div className="sf-flex" style={{ gridArea: '7 / start / auto / 4' }}>
              <div className="sf-box-root sf-bg-blue sf-anim-left-right" style={{ flexGrow: 1 }} />
            </div>
            <div className="sf-flex" style={{ gridArea: '8 / 4 / auto / 6' }}>
              <div className="sf-box-root sf-bg-gray100 sf-anim-left-right sf-tans3s" style={{ flexGrow: 1 }} />
            </div>
            <div className="sf-flex" style={{ gridArea: '2 / 15 / auto / end' }}>
              <div className="sf-box-root sf-bg-cyan200 sf-anim-right-left sf-tans4s" style={{ flexGrow: 1 }} />
            </div>
            <div className="sf-flex" style={{ gridArea: '3 / 14 / auto / end' }}>
              <div className="sf-box-root sf-bg-blue sf-anim-right-left" style={{ flexGrow: 1 }} />
            </div>
            <div className="sf-flex" style={{ gridArea: '4 / 17 / auto / 20' }}>
              <div className="sf-box-root sf-bg-gray100 sf-anim-right-left sf-tans4s" style={{ flexGrow: 1 }} />
            </div>
            <div className="sf-flex" style={{ gridArea: '5 / 14 / auto / 17' }}>
              <div className="sf-box-root sf-box-divider-light-all-2 sf-anim-right-left sf-tans3s" style={{ flexGrow: 1 }} />
            </div>
          </div>
        </div>

        <div className="sf-box-root sf-pt-24 sf-flex sf-flex-col" style={{ flexGrow: 1, zIndex: 9 }}>
          <div className="sf-box-root sf-pt-48 sf-pb-24 sf-flex sf-center">
            <Brand />
          </div>

          <div className="sf-formbg-outer">
            <div className="sf-formbg">
              <div className="sf-formbg-inner sf-ph-48">
                <span className="sf-pb-15">Create your account</span>

                <form onSubmit={onSubmit}>
                  <div className="sf-field sf-pb-24">
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" name="fullName" value={form.fullName} onChange={onChange} required />
                  </div>

                  <div className="sf-field sf-pb-24">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={onChange} required />
                  </div>

                  <div className="sf-field sf-pb-24">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={form.email} onChange={onChange} required />
                  </div>

                  <div className="sf-field sf-pb-24">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={form.password} onChange={onChange} required />
                  </div>

                  <div className="sf-field sf-pb-24">
                    <button className="sf-submit" type="submit" disabled={busy}>
                      {busy ? 'Creating…' : 'Continue'}
                    </button>
                  </div>
                  {msg && <div className="sf-muted">{msg}</div>}
                  {err && <div style={{ color: 'tomato' }}>{err}</div>}
                </form>

                <div className="sf-field" style={{ marginTop: 8 }}>
                  <a className="sf-ssolink" href="/api/auth/login?returnTo=%2Fapp">Use single sign-on (Google) instead</a>
                </div>
              </div>
            </div>

            <div className="sf-footer-link sf-pt-24">
              <span>Already have an account? <a href="/login">Sign in</a></span>
              <div className="sf-listing sf-pt-24 sf-pb-24 sf-flex sf-center">
                <span><a href="/">© AuthLimiter</a></span>
                <span><a href="/#contact">Contact</a></span>
                <span><a href="/#legal">Privacy & terms</a></span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
