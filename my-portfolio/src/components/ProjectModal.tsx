import { useState } from 'react'
import { Download, ExternalLink, Play } from 'lucide-react'
import Modal from './ui/Modal'
import SafeImage from './ui/SafeImage'
import { hasValue } from '../constants/site'
import type { Project } from '../constants/projects'

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [showVideo, setShowVideo] = useState(false)
  const shots = (project.images ?? []).filter(hasValue)
  const isLocalApk = hasValue(project.apkUrl) && project.apkUrl.startsWith('/')

  const links: { label: string; href: string; download?: boolean; icon?: 'dl' }[] = []
  if (hasValue(project.liveUrl)) links.push({ label: 'Live Website', href: project.liveUrl })
  if (hasValue(project.githubUrl)) links.push({ label: 'GitHub Repository', href: project.githubUrl })
  if (hasValue(project.playStoreUrl)) links.push({ label: 'Google Play', href: project.playStoreUrl })
  if (hasValue(project.appStoreUrl)) links.push({ label: 'App Store', href: project.appStoreUrl })
  if (hasValue(project.apkUrl)) links.push({ label: 'Download APK', href: project.apkUrl, download: isLocalApk, icon: 'dl' })
  if (hasValue(project.caseStudyUrl)) links.push({ label: 'View Case Study', href: project.caseStudyUrl })

  return (
    <Modal title={project.title} titleId="project-title" onClose={onClose} className="sm:max-h-[90vh] sm:max-w-4xl">
      <div className="flex-1 overflow-y-auto">
        <div className="aspect-[16/9] w-full bg-neutral-100">
          {showVideo && hasValue(project.video) ? (
            <video src={project.video} controls autoPlay playsInline preload="none" className="h-full w-full bg-black object-contain" />
          ) : (
            <SafeImage src={project.image} alt={`${project.title} cover`} className="h-full w-full object-cover" />
          )}
        </div>

        <div className="space-y-8 p-5 sm:p-8">
          <div>
            <p className="text-sm text-muted">
              {project.category}{hasValue(project.status) && ` · ${project.status}`}
            </p>
            <p className="mt-3 max-w-prose leading-relaxed">{project.description}</p>
          </div>

          <ul className="flex flex-wrap gap-2" aria-label="Technologies">
            {project.technologies.map((t) => (
              <li key={t} className="rounded-md border border-line px-3 py-1 text-sm">{t}</li>
            ))}
          </ul>

          {(links.length > 0 || hasValue(project.video)) && (
            <div className="flex flex-wrap gap-3">
              {hasValue(project.video) && !showVideo && (
                <button className="btn btn-solid" onClick={() => setShowVideo(true)}>
                  <Play size={16} aria-hidden /> Watch Demo
                </button>
              )}
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="btn btn-outline"
                  {...(l.download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  {l.icon === 'dl' ? <Download size={16} aria-hidden /> : <ExternalLink size={16} aria-hidden />}
                  {l.label}
                </a>
              ))}
            </div>
          )}

          {shots.length > 0 && (
            <div>
              <h3 className="mb-4 font-display text-lg font-bold">Screenshots</h3>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {shots.map((s, i) => (
                  <li key={s} className="aspect-[3/4] overflow-hidden rounded-md border border-line bg-neutral-100">
                    <SafeImage src={s} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
