import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')
  const { pathname } = useLocation()
  const key = ids.join('|')

  useEffect(() => {
    // on the standalone projects page there are no home sections to track
    if (pathname === '/projects') {
      setActive('')
      return
    }

    let observer: IntersectionObserver | undefined
    let raf = 0
    let tries = 0

    const setup = () => {
      const els = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)

      // sections not mounted yet, retry for ~1s
      if (els.length === 0) {
        if (tries++ < 60) raf = requestAnimationFrame(setup)
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target.id)
          })
        },
        // a thin band near the middle of the viewport decides the active section
        { rootMargin: '-40% 0px -55% 0px' }
      )

      els.forEach((el) => observer!.observe(el))
    }

    setActive('')
    raf = requestAnimationFrame(setup)

    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
    }
  }, [pathname, key])

  return active
}