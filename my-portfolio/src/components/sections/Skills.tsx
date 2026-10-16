import Section from './Section'
import { skills } from '../../constants/skills'

export default function Skills() {
  return (
    <Section id="skills" heading="Technical skills" dark>
      <dl className="border-t border-line-dark">
        {skills.map((g) => (
          <div key={g.category} className="grid gap-2 border-b border-line-dark py-6 sm:grid-cols-[1fr_2fr] sm:gap-6">
            <dt className="font-display text-lg font-bold">{g.category}</dt>
            <dd className="text-muted-dark">{g.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
