import type { ReactNode } from 'react'
import Reveal from '../ui/Reveal'

interface Props { id: string; heading: string; dark?: boolean; children: ReactNode }

/** Shared section frame: heading column on the left, content on the right. */
export default function Section({ id, heading, dark, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={dark ? 'bg-black text-white' : 'bg-white text-black'}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <Reveal>
          <h2 id={`${id}-h`} className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:sticky lg:top-28">
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="min-w-0">{children}</Reveal>
      </div>
    </section>
  )
}
