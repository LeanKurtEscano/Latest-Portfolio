import Section from './Section'
import { siteConfig } from '../../constants/site'

export default function About() {
  const { heading, paragraphs, interests } = siteConfig.about
  return (
    <Section id="about" heading={heading}>
      <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
        {paragraphs.map((p) => <p key={p}>{p}</p>)}
      </div>
      <ul className="mt-10 grid border-t border-line sm:grid-cols-2" aria-label="Areas of interest">
        {interests.map((i) => (
          <li key={i} className="border-b border-line py-4 font-medium sm:odd:pr-6">{i}</li>
        ))}
      </ul>
    </Section>
  )
}
