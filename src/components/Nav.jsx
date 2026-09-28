import { Link } from 'react-router-dom'

// Router Links (not plain anchors) so section jumps never trigger a full
// page reload — and still work from /projects/* via the leading slash.
const LINKS = [
  { to: '/#about', label: 'about' },
  { to: '/#work', label: 'work' },
  { to: '/#skills', label: 'skills' },
  { to: '/#contact', label: 'contact' },
]

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/#top" className="logo">
          ~/anmol<span>$</span>
        </Link>
        <div>
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
