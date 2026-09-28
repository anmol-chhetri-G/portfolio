import { profile } from '../data/portfolio'

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="shell">
        <div className="badge">open to security internships</div>
        <h1>
          Breaking systems <em>ethically</em> to learn how to defend them.
        </h1>
        <p>
          {profile.name} — {profile.role}. {profile.summary}
        </p>
        <div className="terminal">
          <span className="cmd">$ whoami</span>
          <br />
          anmol · BSc Ethical Hacking · Kathmandu
          <br />
          <span className="cmd">$ cat focus.txt</span>
          <br />
          SIEM triage · Splunk · Elastic · Wazuh · Python
        </div>
        <div className="cta-row">
          <a className="btn btn-primary" href="#work">
            View work →
          </a>
          <a className="btn btn-ghost" href={`mailto:${profile.email}`}>
            Get in touch
          </a>
        </div>
      </div>
    </header>
  )
}
