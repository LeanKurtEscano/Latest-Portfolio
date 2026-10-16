import { useEffect } from 'react'

let locks = 0

/** Prevents background scrolling while `active` is true; restores it afterwards. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const body = document.body
    if (locks++ === 0) {
      const gap = window.innerWidth - document.documentElement.clientWidth
      body.dataset.prevOverflow = body.style.overflow
      body.dataset.prevPad = body.style.paddingRight
      body.style.overflow = 'hidden'
      if (gap > 0) body.style.paddingRight = `${gap}px`
    }
    return () => {
      if (--locks === 0) {
        body.style.overflow = body.dataset.prevOverflow ?? ''
        body.style.paddingRight = body.dataset.prevPad ?? ''
      }
    }
  }, [active])
}
