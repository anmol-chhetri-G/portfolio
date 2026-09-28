import { Link, useParams } from 'react-router-dom'
import { profile } from '../data/portfolio'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = profile.projects.find((item) => item.slug === slug)

  // Unknown slugs (or a stale bookmark) shouldn't 500 or render a blank page.
  if (!project) {
    return (
      <main className="shell detail">
        <div className="kicker">project</div>
        <h1>Project not found</h1>
        <p className="lede">
          No project matches <code>{slug}</code>.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/">
            Back home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="shell detail">
      <Link className="more" to="/#work">
        ← all work
      </Link>

      <div className="kicker">project</div>
      <h1>{project.title}</h1>
      <p className="lede">{project.blurb}</p>

      <div className="tags">
        {project.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <p className="detail-body">{project.description}</p>

      {project.repo && (
        <div className="cta-row">
          <a
            className="btn btn-primary"
            href={project.repo}
            target="_blank"
            rel="noreferrer"
          >
            Source code ↗
          </a>
        </div>
      )}
    </main>
  )
}
