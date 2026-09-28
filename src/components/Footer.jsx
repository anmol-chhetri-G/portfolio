import { profile } from '../data/portfolio'

export default function Footer() {
  return (
    <footer>
      <div className="shell footer-inner">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>built with react · vite · animejs</span>
      </div>
    </footer>
  )
}
