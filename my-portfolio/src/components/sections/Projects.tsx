import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import Section from './Section'
import SafeImage from '../ui/SafeImage'
import ProjectModal from '../ProjectModal'
import { projects } from '../../constants/projects'
import { hasValue } from '../../constants/site'

export default function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const ordered = useMemo(() => [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)), [])
  const selected = projects.find((p) => p.id === selectedId)

  if (!projects.length) return null

  return (
    <Section id="projects" heading="Featured projects">
      <div className="mb-10 flex justify-end">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 rounded-md border border-black bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          View All Projects
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
        {ordered.map((p) => (
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
    </Section>
  )
}