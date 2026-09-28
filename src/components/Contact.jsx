import { profile } from '../data/portfolio'

export default function Contact() {
  return (
    <section id="contact" className="contact" data-reveal>
      <div className="shell">
        <div className="kicker">04 · contact</div>
        <h2>Let&apos;s talk security.</h2>
        <div className="contact-actions">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a
            className="btn btn-ghost"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <a
            className="btn btn-ghost"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </section>
  )
}
