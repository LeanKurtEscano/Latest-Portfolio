import Section from './Section'
import { skills } from '../../constants/skills'

export default function Skills() {
  return (
    <Section id="skills" heading="Technical skills">
      <dl className="border-t border-line">
        {skills.map((g) => (
          <div key={g.category} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[1fr_2fr] sm:gap-6">
            <dt className="font-display text-lg font-bold">{g.category}</dt>
            <dd className="text-muted">{g.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}