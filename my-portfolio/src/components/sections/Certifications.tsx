import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Award as AwardIcon, ArrowUpRight } from 'lucide-react'
import Section from './Section'
import CertificateViewer from '../ui/CertificateViewer'
import { certifications, type Certification } from '../../constants/certifications'
import { hasValue } from '../../constants/site'

export default function Certifications() {
  const [viewing, setViewing] = useState<Certification | null>(null)
  if (!certifications.length) return null

  return (
    <Section id="certifications" heading="Certifications and training">
      <ul className="border-t border-line">
        {certifications.toReversed().map((c) => (
          <li key={`${c.title}-${c.date}`} className="border-b border-line py-6">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <h3 className="font-display text-xl font-bold">{c.title}</h3>
                <p className="mt-1 text-muted">
                  {c.issuer} · {c.date}
                </p>
                {hasValue(c.description) && <p className="mt-3 max-w-prose">{c.description}</p>}
                {hasValue(c.credentialId) && (
                  <p className="mt-2 text-sm text-muted">Credential ID: {c.credentialId}</p>
                )}

                {(hasValue(c.certificateUrl) || hasValue(c.credentialUrl)) && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {hasValue(c.certificateUrl) && (
                      <button
                        type="button"
                        onClick={() => setViewing(c)}
                        aria-haspopup="dialog"
                        className="btn btn-outline"
                      >
                        <AwardIcon size={16} aria-hidden /> View Certificate
                      </button>
                    )}
                    {hasValue(c.credentialUrl) && (
                      <a
                        href={c.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View online credential for ${c.title} (opens in a new tab)`}
                        className="btn btn-outline"
                      >
                        View credential <ArrowUpRight size={16} aria-hidden />
                      </a>
                    )}
                  </div>
                )}
              </div>

              <span className="shrink-0 text-sm text-muted">
                {c.type === 'training' ? 'Training' : 'Certification'}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {viewing && hasValue(viewing.certificateUrl) && (
          <CertificateViewer
            title={viewing.title}
            url={viewing.certificateUrl}
            onClose={() => setViewing(null)}
          />
        )}
      </AnimatePresence>
    </Section>
  )
}