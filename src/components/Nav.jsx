import { Link } from 'react-router-dom'
import { profile } from '../data/portfolio'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  return (
    <header className="nav">
      <Link className="nav__brand" to="/">
        {profile.name}
      </Link>

      <nav className="nav__links" aria-label="Sections">
        {LINKS.map((link) => (
          <a className="nav__link" href={`/#${link.id}`} key={link.id}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
