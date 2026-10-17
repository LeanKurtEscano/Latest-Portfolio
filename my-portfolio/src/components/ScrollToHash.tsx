import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '../lib'

export default function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pathname !== '/' || !hash) return

    const id = hash.slice(1)
    let tries = 0
    let raf = 0

    const attempt = () => {
      if (document.getElementById(id)) {
        scrollToSection(id)
        return
      }
      // section not rendered yet, retry for up to ~0.5s
      if (tries++ < 30) raf = requestAnimationFrame(attempt)
    }

    raf = requestAnimationFrame(attempt)
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])

  return null
}