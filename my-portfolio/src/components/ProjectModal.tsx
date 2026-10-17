import { useState } from 'react'
import { Download, ExternalLink, Play } from 'lucide-react'
import Modal from './ui/Modal'
import SafeImage from './ui/SafeImage'
import ProjectCover from './ui/ProjectCover'
import { hasValue } from '../constants/site'
import { getScreens, isMobileProject } from '../constants/projects'
import type { Project } from '../constants/projects'

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [showVideo, setShowVideo] = useState(false)
  const isLocalApk = hasValue(project.apkUrl) && project.apkUrl.startsWith('/')
  const mobileOnly = isMobileProject(project)

  const screens = getScreens(project)
  const groups = [
    { key: 'web', label: 'Web', items: screens.web.filter(hasValue) },
    { key: 'mobile', label: 'Mobile', items: screens.mobile.filter(hasValue) },
  ].filter((g) => g.items.length > 0)

  const links: { label: string; href: string; download?: boolean; icon?: 'dl' }[] = []
  if (hasValue(project.websiteUrl)) links.push({ label: 'Visit Website', href: project.websiteUrl })
  if (hasValue(project.liveUrl)) links.push({ label: 'Live Website', href: project.liveUrl })
  if (hasValue(project.githubUrl)) links.push({ label: 'GitHub Repository', href: project.githubUrl })
  if (hasValue(project.playStoreUrl)) links.push({ label: 'Google Play', href: project.playStoreUrl })
  if (hasValue(project.appStoreUrl)) links.push({ label: 'App Store', href: project.appStoreUrl })
  if (hasValue(project.apkUrl)) links.push({ label: 'Download APK', href: project.apkUrl, download: isLocalApk, icon: 'dl' })
  if (hasValue(project.caseStudyUrl)) links.push({ label: 'View Case Study', href: project.caseStudyUrl })

  return (
    <Modal title={project.title} titleId="project-title" onClose={onClose} className="sm:max-h-[90vh] sm:max-w-4xl">
      <div className="flex-1 overflow-y-auto">
        {/* Hero: tall box for mobile-only, 16:9 for web and hybrid */}
        <div
          className={
            mobileOnly
              ? 'flex h-[60vh] max-h-[620px] w-full items-center justify-center bg-neutral-100 py-4'
              : 'flex aspect-[16/9] w-full items-center justify-center bg-neutral-100'
          }
        >
          {showVideo && hasValue(project.video) ? (
            <video
              src={project.video}
              controls
              autoPlay
              playsInline
              preload="none"
              className="h-full w-full bg-black object-contain"
            />
          ) : (
            <ProjectCover project={project} variant="hero" />
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

          {groups.length > 0 && (
            <div className="space-y-8">
              <h3 className="font-display text-lg font-bold">Screenshots</h3>
              {groups.map((g) => {
                const isMobileGroup = g.key === 'mobile'
                return (
                  <div key={g.key}>
                    {groups.length > 1 && (
                      <h4 className="mb-3 text-sm font-medium text-muted">{g.label}</h4>
                    )}
                    <ul
                      className={`grid gap-3 ${
                        isMobileGroup ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'
                      }`}
                    >
                      {g.items.map((s, i) => (
                        <li
                          key={`${s}-${i}`}
                          className={`overflow-hidden rounded-md border border-line bg-neutral-100 ${
                            isMobileGroup ? 'aspect-[9/19]' : 'aspect-video'
                          }`}
                        >
                          <SafeImage
                            src={s}
                            alt={`${project.title} ${g.label.toLowerCase()} screenshot ${i + 1}`}
                            loading="lazy"
                            className="h-full w-full object-contain"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}