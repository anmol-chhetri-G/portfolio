import { Link } from 'react-router-dom'
import { profile } from '../data/portfolio'

export default function Work() {
  return (
    <section id="work" data-reveal>
      <div className="shell">
        <div className="kicker">03 · work</div>
        <h2>Projects built to understand attackers.</h2>
        {profile.projects.map((project, i) => (
          <article className="project" key={project.slug}>
            <div className="num">{String(i + 1).padStart(2, '0')}</div>
            <div>
              <h3>
                <Link to={`/projects/${project.slug}`}>{project.title}</Link>
              </h3>
              <p>{project.blurb}</p>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link className="more" to={`/projects/${project.slug}`}>
                read more →
              </Link>
            </div>
          </article>
        ))}
        <h2 style={{ marginTop: 64, fontSize: 24 }}>Tinkering</h2>
        <ul className="tinker-list">
          {profile.tinkering.map((item) => (
            <li key={item.title}>
              <a href={item.repo} target="_blank" rel="noreferrer">
                {item.title} ↗
              </a>
              <span>{item.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
