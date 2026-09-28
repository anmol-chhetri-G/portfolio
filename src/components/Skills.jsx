import { profile } from '../data/portfolio'

export default function Skills() {
  return (
    <section id="skills" data-reveal>
      <div className="shell">
        <div className="kicker">03 · skills & certs</div>
        <h2>Tools of the trade.</h2>
        <div className="skills-grid">
          {profile.skills.map((group) => (
            <div className="skill-card" key={group.label}>
              <h3>{group.label}</h3>
              <div className="tags">
                {group.items.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <h2 style={{ marginTop: 64, fontSize: 24 }}>
          Certifications & Achievements
        </h2>
        <ul className="cert-list">
          {profile.certs.map((cert) => (
            <li key={cert}>{cert}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
