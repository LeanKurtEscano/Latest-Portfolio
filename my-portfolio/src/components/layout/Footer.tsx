import { ArrowUp } from 'lucide-react'
import { hasValue, siteConfig } from '../../constants/site'
import { scrollToTop } from '../../lib'

const year = new Date().getFullYear()

export default function Footer() {
  const socials = siteConfig.contact.socials.filter((s) => hasValue(s.url))
  return (
    <footer className="border-t border-line-dark bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-muted-dark">
          © {year} <span className="font-semibold text-white">{siteConfig.name}</span>
        </p>
        <div className="flex flex-wrap items-center gap-6 text-sm">
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted-dark transition-colors hover:text-white">{s.label}</a>
          ))}
          <button onClick={scrollToTop} className="inline-flex min-h-11 items-center gap-2 font-semibold">
            Back to top <ArrowUp size={16} aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  )
}
