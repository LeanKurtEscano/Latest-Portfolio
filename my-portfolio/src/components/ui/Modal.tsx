import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { useScrollLock } from '../../hooks/useScrollLock'

interface Props {
  title: string
  titleId: string
  onClose: () => void
  children: ReactNode
  headerActions?: ReactNode
  /** Tailwind sizing classes for the panel */
  className?: string
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,iframe,video[controls],[tabindex]:not([tabindex="-1"])'

export default function Modal({ title, titleId, onClose, children, headerActions, className = '' }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  useScrollLock(true)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const root = panel.current
    root?.querySelector<HTMLElement>('[data-close]')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return }
      if (e.key !== 'Tab' || !root) return
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!items.length) return
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); previous?.focus() }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        ref={panel}
        role="dialog" aria-modal="true" aria-labelledby={titleId}
        className={`flex h-dvh w-full flex-col overflow-hidden bg-paper text-ink sm:h-auto sm:rounded-lg ${className}`}
        initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
          <h2 id={titleId} className="truncate font-display text-lg font-bold">{title}</h2>
          <div className="flex shrink-0 items-center gap-2">
            {headerActions}
            <button data-close onClick={onClose} aria-label={`Close ${title}`} className="btn btn-outline !px-3">
              <X size={18} aria-hidden />
            </button>
          </div>
        </header>
        {children}
      </motion.div>
    </motion.div>
  )
}
