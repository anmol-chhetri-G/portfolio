import { profile } from '../data/portfolio'

export default function About() {
  return (
    <section id="about" data-reveal>
      <div className="shell">
        <div className="kicker">01 · about</div>
        <h2>Blue team core, red team curiosity.</h2>
        <div className="about-grid">
          <div>
            <p>{profile.summary}</p>
            <p>
              Currently pursuing a BSc (Hons) in Ethical Hacking and
              Cybersecurity at Softwarica College in partnership with Coventry
              University. I learn by building — intrusion detectors,
              steganography tools, and offensive security projects that teach
              me exactly what defenders are up against.
            </p>
          </div>
          <div className="meta">
            {profile.education.map((entry) => (
              <div key={entry.title}>
                <span>Education</span>
                {entry.title}
                <br />
                {entry.place} · {entry.period}
              </div>
            ))}
            <div>
              <span>Location</span>
              {profile.location}
            </div>
            <div>
              <span>Phone</span>
              {profile.phone}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
