export default function Home() {
  return (
    <div className="page-home">
      <>
        <header className="nav">
          <div className="nav-inner container">
            <div className="brand">
              <span className="brand-mark" />
              <span>AuthLimiter</span>
            </div>
            <nav className="nav-links">
              <a className="link" href="#benefits">Benefits</a>
              <a className="link" href="#code">Code</a>
              <a className="btn" href="/login">Login</a>
              <a className="btn btn-primary" href="/signup">Sign up</a>
            </nav>
          </div>
        </header>

        <main className="container" style={{ paddingTop: 24 }}>
          <section className="card hero">
            <div>
              <h1 className="hero-title">Control concurrent device logins with style.</h1>
              <p className="hero-sub">
                AuthLimiter prevents account sharing and session sprawl by enforcing an N-device limit
                with graceful evictions, instant prompts, and a delightful UX.
              </p>
              <div className="row" style={{ marginTop: 16 }}>
                <a className="btn btn-primary" href="/app">Open App</a>
                <a className="btn" href="#benefits">Learn more</a>
              </div>
            </div>
            <div className="hero-visual" />
          </section>

          <section id="benefits" className="section">
            <div className="grid">
              <div className="tile">
                <h3>Enforce at login</h3>
                <p>Block N+1 sessions on the spot—no delays, no race conditions, instant feedback.</p>
              </div>
              <div className="tile">
                <h3>Graceful eviction</h3>
                <p>Evicted devices auto-logout with a friendly message and cleared device IDs.</p>
              </div>
              <div className="tile">
                <h3>Beautiful UX</h3>
                <p>Blocking modal with animations, polished buttons, and micro-interactions.</p>
              </div>
            </div>
          </section>

          <section id="code" className="section">
            <div className="github-card">
              <div>
                <h3 style={{ margin: 0 }}>See the source</h3>
                <p className="muted" style={{ margin: '6px 0 0 0' }}>Explore the full implementation on GitHub.</p>
              </div>
              <a className="github-link" href="https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO" target="_blank" rel="noreferrer">Open GitHub →</a>
            </div>
          </section>
        </main>

        <footer className="container footer">
          <h4>Contact</h4>
          <div>
            <div>Balwinder Singh</div>
            <div>Phone: <a href="tel:+919781186435">9781186435</a></div>
            <div>Email: <a href="mailto:1231262balwindersingh@gmail.com">1231262balwindersingh@gmail.com</a></div>
          </div>
        </footer>
      </>
    </div>
  );
}
