import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Two jobs on every navigation:
 * 1. Scroll position — a hash (/#about) scrolls that section into view,
 *    a fresh route starts at the top.
 * 2. Scroll reveal — one-shot IntersectionObserver that adds `.in` to
 *    `[data-reveal]` sections as they enter the viewport.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, key])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15 },
    )
    document
      .querySelectorAll('[data-reveal]:not(.in)')
      .forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
