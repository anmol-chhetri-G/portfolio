import { profile } from '../data/portfolio'

export default function Contact() {
  return (
    <section className="section" id="contact">
      <h2 className="section__title">Contact</h2>

      <p className="contact__lead">
        Open to new work. The fastest way to reach me is email &mdash; or find me
        around the web.
      </p>

      <ul className="contact__links">
        {profile.links.map((link) => (
          <li key={link.label}>
            <a className="button" href={link.href} rel="noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
