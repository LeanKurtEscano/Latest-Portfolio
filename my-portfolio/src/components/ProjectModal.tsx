import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Download, ExternalLink, Minus, Play, Plus, X } from 'lucide-react'
import Modal from './ui/Modal'
import SafeImage from './ui/SafeImage'
import ProjectCover from './ui/ProjectCover'
import { hasValue } from '../constants/site'
import { getScreens, isMobileProject } from '../constants/projects'
import type { Project } from '../constants/projects'

type Shot = { src: string; alt: string }

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.5

const clamp = (n: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, n))

const iconBtn =
  'flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-30 disabled:hover:bg-white/10'

/* ---------- Fullscreen image viewer: next/prev + zoom + pan ---------- */
function Lightbox({
  shots,
  index,
  onIndex,
  onClose,
}: {
  shots: Shot[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

  const shot = shots[index]
  const multiple = shots.length > 1

  const reset = useCallback(() => {
    setZoom(1)
    setPos({ x: 0, y: 0 })
  }, [])

  const changeZoom = useCallback((next: number) => {
    const z = clamp(next)
    setZoom(z)
    if (z === 1) setPos({ x: 0, y: 0 })
  }, [])

  const go = useCallback(
    (dir: number) => onIndex((index + dir + shots.length) % shots.length),
    [index, shots.length, onIndex],
  )

  // Back to normal zoom whenever the image changes
  useEffect(() => {
    reset()
  }, [index, reset])

  // Lock page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Keyboard: Esc closes only the viewer (not the project modal behind it)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation()
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowRight' && multiple) go(1)
      else if (e.key === 'ArrowLeft' && multiple) go(-1)
      else if (e.key === '+' || e.key === '=') changeZoom(zoom + ZOOM_STEP)
      else if (e.key === '-') changeZoom(zoom - ZOOM_STEP)
      else if (e.key === '0') reset()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [go, multiple, zoom, changeZoom, reset, onClose])

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }
    setDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    setPos({
      x: drag.current.px + (e.clientX - drag.current.x),
      y: drag.current.py + (e.clientY - drag.current.y),
    })
  }
  const endDrag = () => {
    drag.current = null
    setDragging(false)
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3 sm:p-4">
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {index + 1} / {shots.length}
        </span>
        <button type="button" onClick={onClose} aria-label="Close image viewer" className={iconBtn}>
          <X size={20} aria-hidden />
        </button>
      </div>

      {/* Image */}
      <div
        className={`flex h-full w-full touch-none items-center justify-center overflow-hidden ${
          zoom > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        onWheel={(e) => changeZoom(zoom + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP))}
        onDoubleClick={() => (zoom > 1 ? reset() : changeZoom(2.5))}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
            transition: dragging ? 'none' : 'transform 150ms ease-out',
          }}
        >
          <SafeImage
            src={shot.src}
            alt={shot.alt}
            className="max-h-[85vh] max-w-[92vw] select-none object-contain"
          />
        </div>
      </div>

      {/* Prev / next */}
      {multiple && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className={`${iconBtn} absolute left-2 top-1/2 -translate-y-1/2 sm:left-4`}
          >
            <ChevronLeft size={22} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className={`${iconBtn} absolute right-2 top-1/2 -translate-y-1/2 sm:right-4`}
          >
            <ChevronRight size={22} aria-hidden />
          </button>
        </>
      )}

      {/* Zoom controls */}
      <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => changeZoom(zoom - ZOOM_STEP)}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
          className={iconBtn}
        >
          <Minus size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset zoom"
          className="h-10 min-w-[4rem] rounded-full bg-white/10 px-3 text-sm text-white transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={() => changeZoom(zoom + ZOOM_STEP)}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
          className={iconBtn}
        >
          <Plus size={18} aria-hidden />
        </button>
      </div>
    </div>,
    document.body,
  )
}

/* ---------- Project modal ---------- */
export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [showVideo, setShowVideo] = useState(false)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const isLocalApk = hasValue(project.apkUrl) && project.apkUrl.startsWith('/')
  const mobileOnly = isMobileProject(project)

  const screens = getScreens(project)
  const groups = [
    { key: 'web', label: 'Web', items: screens.web.filter(hasValue) },
    { key: 'mobile', label: 'Mobile', items: screens.mobile.filter(hasValue) },
  ].filter((g) => g.items.length > 0)

  // One flat list so the viewer can step through web + mobile screenshots together
  const shots: Shot[] = groups.flatMap((g) =>
    g.items.map((src, i) => ({
      src,
      alt: `${project.title} ${g.label.toLowerCase()} screenshot ${i + 1}`,
    })),
  )
  let shotCounter = 0

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
              ? 'relative flex h-[60vh] max-h-[620px] w-full items-center justify-center bg-neutral-100 py-4'
              : 'relative flex aspect-[16/9] w-full items-center justify-center bg-neutral-100'
          }
        >
          {showVideo && hasValue(project.video) ? (
            <>
              <video
                src={project.video}
                controls
                autoPlay
                playsInline
                preload="none"
                className="h-full w-full bg-black object-contain"
              />
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                aria-label="Close video"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X size={18} aria-hidden />
              </button>
            </>
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
                      {g.items.map((s, i) => {
                        const flatIndex = shotCounter++
                        return (
                          <li
                            key={`${s}-${i}`}
                            className={`overflow-hidden rounded-md border border-line bg-neutral-100 ${
                              isMobileGroup ? 'aspect-[9/19]' : 'aspect-video'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setViewerIndex(flatIndex)}
                              aria-label={`View ${g.label.toLowerCase()} screenshot ${i + 1} larger`}
                              className="block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black"
                            >
                              <SafeImage
                                src={s}
                                alt={shots[flatIndex].alt}
                                loading="lazy"
                                className="h-full w-full object-contain"
                              />
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {viewerIndex !== null && (
        <Lightbox
          shots={shots}
          index={viewerIndex}
          onIndex={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </Modal>
  )
}