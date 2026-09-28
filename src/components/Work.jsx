import { Link } from 'react-router-dom'
import { projects } from '../data/portfolio'

export default function Work() {
  return (
    <section className="section" id="work">
      <h2 className="section__title">Work</h2>

      <ul className="cards">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link className="card" to={`/projects/${project.slug}`}>
              <span className="card__title">{project.title}</span>
              <span className="card__blurb">{project.blurb}</span>
              <span className="card__tech">
                {project.tech.map((tech) => (
                  <span className="tag" key={tech}>
                    {tech}
                  </span>
                ))}
              </span>
              <span className="card__cta">Read more &rarr;</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
