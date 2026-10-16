import { useEffect, useState } from 'react'
import { Download, ExternalLink, Loader2 } from 'lucide-react'
import Modal from './ui/Modal'
import { siteConfig } from '../constants/site'

type Status = 'checking' | 'ready' | 'missing'

export default function ResumeViewer({ onClose }: { onClose: () => void }) {
  const url = siteConfig.resumeUrl
  const [status, setStatus] = useState<Status>('checking')
  const [loaded, setLoaded] = useState(false)
  // Some mobile browsers cannot render PDFs inline.
  const canEmbed = typeof navigator === 'undefined' || navigator.pdfViewerEnabled !== false

  useEffect(() => {
    const ctrl = new AbortController()
    // Dev servers and SPA hosts often answer 200 with index.html for missing files, so check the content type too.
    fetch(url, { method: 'HEAD', signal: ctrl.signal })
      .then((r) => setStatus(r.ok && (r.headers.get('content-type') ?? '').includes('pdf') ? 'ready' : 'missing'))
      .catch((e) => { if (e.name !== 'AbortError') setStatus('missing') })
    return () => ctrl.abort()
  }, [url])

  const actions = status === 'ready' && (
    <a href={url} download className="btn btn-solid hidden sm:inline-flex">
      <Download size={16} aria-hidden /> Download Resume
    </a>
  )

  return (
    <Modal title="Resume" titleId="resume-title" onClose={onClose} headerActions={actions} className="sm:h-[92vh] sm:max-w-5xl">
      <div className="relative min-h-0 flex-1 bg-neutral-100">
        {status === 'checking' && (
          <p className="flex h-full items-center justify-center gap-2 text-muted" role="status">
            <Loader2 className="animate-spin" size={18} aria-hidden /> Loading resume…
          </p>
        )}

        {status === 'missing' && (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="font-display text-xl font-bold">The resume is temporarily unavailable.</p>
            <p className="max-w-sm text-muted">Please check back soon, or get in touch and I'll send it over directly.</p>
          </div>
        )}

        {status === 'ready' && canEmbed && (
          <>
            {!loaded && (
              <p className="absolute inset-0 flex items-center justify-center gap-2 text-muted" role="status">
                <Loader2 className="animate-spin" size={18} aria-hidden /> Loading resume…
              </p>
            )}
            <iframe
              title="Resume PDF"
              src={`${url}#view=FitH`}
              onLoad={() => setLoaded(true)}
              className="relative h-full w-full border-0 bg-white"
            />
          </>
        )}

        {status === 'ready' && !canEmbed && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="max-w-sm text-muted">Your browser can't show PDFs inside the page. Open the resume in a new tab or download it.</p>
          </div>
        )}
      </div>

      {status === 'ready' && (
        <footer className="flex flex-wrap items-center justify-center gap-3 border-t border-line px-4 py-3 text-sm">
          <span className="text-muted">Trouble viewing?</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold underline underline-offset-4">
            Open in new tab <ExternalLink size={14} aria-hidden />
          </a>
          <a href={url} download className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 sm:hidden">
            Download Resume <Download size={14} aria-hidden />
          </a>
        </footer>
      )}
    </Modal>
  )
}
