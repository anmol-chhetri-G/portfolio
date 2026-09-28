import DotGrid from './DotGrid'
import { profile } from '../data/portfolio'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__grid" aria-hidden="true">
        <DotGrid label="" />
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow">{profile.role}</p>
        <h1 className="hero__title">{profile.name}</h1>
        <p className="hero__tagline">{profile.tagline}</p>

        <div className="hero__actions">
          <a className="button button--primary" href="#work">
            View work
          </a>
          <a className="button" href="#contact">
            Get in touch
          </a>
        </div>
      </div>
    </section>
  )
}
