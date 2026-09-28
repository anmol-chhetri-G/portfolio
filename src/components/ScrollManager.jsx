import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Restores sensible scroll positions on navigation:
 * - a hash (/#about) scrolls that section into view
 * - a fresh route starts at the top
 * - a back/forward visit restores the previous offset
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

  return null
}
