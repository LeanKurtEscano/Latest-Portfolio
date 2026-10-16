import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { navLinks, siteConfig } from '../../constants/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { scrollToSection, scrollToTop } from '../../lib'

const ids = navLinks.map((l) => l.id)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(ids)

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // wait a tick so the closing menu doesn't affect the scroll offset
    requestAnimationFrame(() => scrollToSection(id))
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <a href="#home" onClick={(e) => { e.preventDefault(); setOpen(false); scrollToTop() }} className="font-display text-lg font-extrabold tracking-tight">
          {siteConfig.name}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={go(l.id)}
                aria-current={active === l.id ? 'true' : undefined}
                className={`border-b-2 py-1 text-sm font-medium transition-colors ${active === l.id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="-mr-2 flex size-11 items-center justify-center md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="overflow-hidden border-t border-line bg-white md:hidden"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="px-5 py-2">
              {navLinks.map((l) => (
                <li key={l.id} className="border-b border-line last:border-0">
                  <a href={`#${l.id}`} onClick={go(l.id)} className="flex min-h-12 items-center text-base font-medium">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
