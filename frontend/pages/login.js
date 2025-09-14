function Brand() {
  return (
    <a href="/" className="sf-brand" aria-label="AuthLimiter Home">
      <span className="sf-brand-mark" />
      <span className="sf-brand-text">AuthLimiter</span>
    </a>
  );
}

export default function Login() {
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
                <span className="sf-pb-15">Sign in to your account</span>

                <div className="sf-field sf-pb-24">
                  <a className="sf-submit" href="/api/auth/login?returnTo=%2Fapp">Continue with Auth0</a>
                </div>

                <div className="sf-field">
                  <a className="sf-ssolink" href="/api/auth/login?returnTo=%2Fapp">Use single sign-on (Google) instead</a>
                </div>
              </div>
            </div>

            <div className="sf-footer-link sf-pt-24">
              <span>Don't have an account? <a href="/signup">Sign up</a></span>
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
