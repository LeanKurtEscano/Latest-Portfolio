import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import SafeImage from '../ui/SafeImage'
import ProjectModal from '../ProjectModal'
import { hasValue } from '../../constants/site'
import { projects } from '../../constants/projects'

export default function ProjectsPage() {
  const [category, setCategory] = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [])
  const visible = useMemo(
    () =>
      projects
        .filter((p) => category === 'All' || p.category === category)
        .sort((a, b) => Number(!!b.featured) - Number(!!a.featured)),
    [category],
  )
  const selected = projects.find((p) => p.id === selectedId)

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
      <Link
        to="/#projects"
        className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-300 hover:text-black"
      >
        <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        Back to home
      </Link>

      <header className="mt-8 border-b border-line pb-8">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">All projects</h1>
        <p className="mt-3 max-w-xl text-muted">A complete collection of what I've built.</p>

        {categories.length > 2 && (
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 ${
                  category === c
                    ? 'border-black bg-black text-white'
                    : 'border-line text-muted hover:border-black hover:text-black'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </header>

      <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li key={p.id}>
            <button onClick={() => setSelectedId(p.id)} aria-haspopup="dialog" className="group block w-full text-left">
              <div className="aspect-[4/3] overflow-hidden rounded-md border border-line bg-neutral-100">
                <SafeImage
                  src={p.image} alt={`${p.title} cover`} loading="lazy" width={800} height={600}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-5 text-sm text-muted">{p.category}{hasValue(p.status) && ` · ${p.status}`}</p>
              <h3 className="mt-1 font-display text-2xl font-bold underline-offset-[6px] decoration-2 group-hover:underline">{p.title}</h3>
              <p className="mt-2 line-clamp-2 text-muted">{p.description}</p>
              <p className="mt-3 text-sm font-medium">{p.technologies.join(' · ')}</p>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {selected && <ProjectModal key={selected.id} project={selected} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </div>
  )
}