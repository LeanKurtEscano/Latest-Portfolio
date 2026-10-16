import SafeImage from './SafeImage';
import { hasValue } from '../../constants/site';
import type { Project } from '../../constants/projects';

type Props = { project: Project; onOpen: (id: string) => void }

export default function ProjectCard({ project: p, onOpen }: Props) {
  return (
    <div className="group relative">
      <div className="aspect-[4/3] overflow-hidden rounded-md border border-line bg-neutral-100">
        <SafeImage
          src={p.image} alt={`${p.title} cover`} loading="lazy" width={800} height={600}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <p className="mt-5 text-sm text-muted">{p.category}{hasValue(p.status) && ` · ${p.status}`}</p>
      <h3 className="mt-1 font-display text-2xl font-bold underline-offset-[6px] decoration-2 group-hover:underline">
        {/* after:absolute after:inset-0 stretches the click target over the whole card */}
        <button
          onClick={() => onOpen(p.id)}
          aria-haspopup="dialog"
          className="text-left after:absolute after:inset-0 focus-visible:outline-none"
        >
          {p.title}
        </button>
      </h3>
      <p className="mt-2 line-clamp-2 text-muted">{p.description}</p>
      <p className="mt-3 text-sm font-medium">{p.technologies.join(' · ')}</p>
    </div>
  )
}