import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../../context/useTheme'
import { navLinks, siteConfig } from '../../constants/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { scrollToSection, scrollToTop } from '../../lib'

const ids = navLinks.map((l) => l.id)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(ids)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const isHome = pathname !== '/projects'

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)

    if (isHome) {
      // wait a tick so the closing menu doesn't affect the scroll offset
      requestAnimationFrame(() => scrollToSection(id))
    } else {
      // go to home with the hash; <ScrollToHash /> does the scrolling
      navigate({ pathname: '/', hash: `#${id}` })
    }
  }

  const goTop = (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    if (isHome) scrollToTop()
    else navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper backdrop-blur transition-colors">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
        aria-label="Primary"
      >
        <Link
          to="/"
          onClick={goTop}
          className="font-display text-lg font-extrabold tracking-tight"
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => {
              const isActive = isHome && active === l.id
              return (
                <li key={l.id}>
                  <a
                    href={`/#${l.id}`}
                    onClick={go(l.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`border-b-2 py-1 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-ink text-ink'
                        : 'border-transparent text-muted hover:text-ink'
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-1 md:border-l md:border-line md:pl-6">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="inline-flex size-11 items-center justify-center rounded-md border border-line text-ink transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-ink"
            >
              {theme === 'light' ? (
                <Moon size={18} aria-hidden />
              ) : (
                <Sun size={18} aria-hidden />
              )}
            </button>

            <button
              type="button"
              className="flex size-11 items-center justify-center md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="overflow-hidden border-t border-line bg-paper md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="px-5 py-2">
              {navLinks.map((l) => (
                <li key={l.id} className="border-b border-line last:border-0">
                  <a
                    href={`/#${l.id}`}
                    onClick={go(l.id)}
                    className="flex min-h-12 items-center text-base font-medium"
                  >
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