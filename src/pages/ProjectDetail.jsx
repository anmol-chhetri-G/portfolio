import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/portfolio'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  // Unknown slugs (or a stale bookmark) shouldn't 500 or render a blank page.
  if (!project) {
    return (
      <main className="container page">
        <h1>Project not found</h1>
        <p>
          No project matches <code>{slug}</code>.
        </p>
        <Link className="button button--primary" to="/">
          Back home
        </Link>
      </main>
    )
  }

  return (
    <main className="container page">
      <Link className="backlink" to="/#work">
        &larr; All work
      </Link>

      <h1 className="page__title">{project.title}</h1>
      <p className="page__lede">{project.blurb}</p>

      <div className="page__tags">
        {project.tech.map((tech) => (
          <span className="tag" key={tech}>
            {tech}
          </span>
        ))}
        <span className="tag tag--muted">{project.year}</span>
      </div>

      <p className="page__body">{project.description}</p>

      <div className="hero__actions">
        {project.repo && (
          <a
            className="button button--primary"
            href={project.repo}
            rel="noreferrer"
          >
            Source code
          </a>
        )}
        {project.live && (
          <a className="button" href={project.live} rel="noreferrer">
            Live site
          </a>
        )}
      </div>
    </main>
  )
}
