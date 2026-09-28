import { experience, profile } from '../data/portfolio'

export default function About() {
  return (
    <section className="section" id="about">
      <h2 className="section__title">About</h2>

      <div className="about">
        <div className="about__bio">
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="about__meta">
            {profile.location} &middot;{' '}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
        </div>

        <ol className="timeline">
          {experience.map((item) => (
            <li className="timeline__item" key={item.role + item.org}>
              <div className="timeline__head">
                <span className="timeline__role">{item.role}</span>
                <span className="timeline__period">{item.period}</span>
              </div>
              <span className="timeline__org">{item.org}</span>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
