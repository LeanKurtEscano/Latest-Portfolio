import Section from './Section'
import { timeline } from '../../constants/experience'

export default function Experience() {
  if (!timeline.length) return null
  return (
    <Section id="experience" heading="Experience">
      <ol className="border-t border-line">
        {timeline.map((e) => (
          <li key={`${e.title}-${e.period}`} className="grid gap-2 border-b border-line py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
            <p className="text-sm text-muted">{e.period}</p>
            <div>
              <h3 className="font-display text-xl font-bold">{e.title}</h3>
              <p className="text-muted">{e.organization}</p>
              {e.description && <p className="mt-3 max-w-prose">{e.description}</p>}
              {e.technologies && e.technologies.length > 0 && (
                <p className="mt-3 text-sm font-medium">{e.technologies.join(' · ')}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
