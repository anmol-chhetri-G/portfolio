import { profile } from '../data/portfolio'

export default function Experience() {
  return (
    <section id="experience" data-reveal>
      <div className="shell">
        <div className="kicker">02 · experience</div>
        <h2>Doing the work, not just studying it.</h2>
        {profile.experience.map((job) => (
          <article className="job" key={job.role + job.org}>
            <div className="job-head">
              <h3>{job.role}</h3>
              <span className="job-period">{job.period}</span>
            </div>
            <p className="job-org">
              {job.org} · {job.type} · {job.location}
            </p>
            <ul>
              {job.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
