export default function LoggedOut() {
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
              <a className="link" href="/">Home</a>
              <a className="btn" href="/api/auth/login?returnTo=%2Fapp">Login</a>
              <a className="btn btn-primary" href="/signup">Sign up</a>
            </nav>
          </div>
        </header>

        <main className="container" style={{ paddingTop: 24 }}>
          <section className="card" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <h1 className="title" style={{ marginBottom: 10 }}>Signed out on this device</h1>
            <p className="muted" style={{ marginTop: 0 }}>
              This device was logged out because the session was revoked or removed elsewhere. It’s safe to sign in again below.
            </p>
            <div className="row" style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
              <a className="btn" href="/api/auth/login?returnTo=%2Fapp">Login</a>
              <a className="btn btn-primary" href="/signup">Create account</a>
              <a className="btn" href="/">Go to Home</a>
            </div>
          </section>

          <section className="card" style={{ maxWidth: 720, margin: '16px auto 0' }}>
            <h2 className="title" style={{ fontSize: 20, marginBottom: 8 }}>Why did this happen?</h2>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Another login evicted this device due to the concurrent device limit. Sign in again if access is needed.</li>
              <li>Inactive or manually logged out sessions will also show this page when returning.</li>
            </ul>
          </section>
        </main>
      </>
    </div>
  );
}
