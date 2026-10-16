import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Award as AwardIcon, ArrowUpRight } from 'lucide-react'
import Section from './Section'
import CertificateViewer from '../ui/CertificateViewer'
import { awards, type Award } from '../../constants/awards'
import { hasValue } from '../../constants/site'

export default function Awards() {
  const [viewing, setViewing] = useState<Award | null>(null)
  if (!awards.length) return null

  return (
    <Section id="awards" heading="Awards">
      <ul className="border-t border-line">
        {awards.map((a) => (
          <li key={`${a.title}-${a.date}`} className="grid gap-2 border-b border-line py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
            <p className="text-sm text-muted">{a.date}</p>
            <div>
              <h3 className="font-display text-xl font-bold">{a.title}</h3>
              <p className="text-muted">{a.issuer}</p>
              {hasValue(a.description) && <p className="mt-3 max-w-prose">{a.description}</p>}

              {(hasValue(a.certificateUrl) || hasValue(a.linkUrl)) && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {hasValue(a.certificateUrl) && (
                    <button onClick={() => setViewing(a)} aria-haspopup="dialog" className="btn btn-outline">
                      <AwardIcon size={16} aria-hidden /> View Certificate
                    </button>
                  )}
                  {hasValue(a.linkUrl) && (
                    <a href={a.linkUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      Learn more <ArrowUpRight size={16} aria-hidden />
                    </a>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {viewing && hasValue(viewing.certificateUrl) && (
          <CertificateViewer title={viewing.title} url={viewing.certificateUrl} onClose={() => setViewing(null)} />
        )}
      </AnimatePresence>
    </Section>
  )
}