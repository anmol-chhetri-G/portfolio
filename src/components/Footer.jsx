import { profile } from '../data/portfolio'

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        Built with React, Vite and animejs. &copy; {new Date().getFullYear()}{' '}
        {profile.name}.
      </p>
    </footer>
  )
}
