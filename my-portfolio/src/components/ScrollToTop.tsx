import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // don't fight ScrollToHash when there's a #section in the URL
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}