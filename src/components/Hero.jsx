import { profile } from '../data/portfolio'

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="shell hero-grid">
        <div>
          <div className="badge">open to security internships</div>
          <p className="hero-eyebrow">Hello, I&apos;m</p>
          <h1>
            Anmol Singh <span>Chhetri</span>
          </h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-summary">{profile.summary}</p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#work">
              View work →
            </a>
            <a className="btn btn-ghost" href={`mailto:${profile.email}`}>
              Get in touch
            </a>
          </div>
          <div className="hero-socials">
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="arch">
            <span className="monogram">AC</span>
          </div>
          <div className="hero-card">
            <strong>Currently</strong>
            BSc Ethical Hacking
            <br />
            SIEM triage · Python
          </div>
        </div>
      </div>
    </header>
  )
}
