import { useEffect, useState } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'
import Modal from './Modal'

type Kind = 'pdf' | 'image' | 'external'
type Status = 'checking' | 'ready' | 'missing'

const getKind = (url: string): Kind => {
  const path = url.split(/[?#]/)[0].toLowerCase()
  if (path.endsWith('.pdf')) return 'pdf'
  if (/\.(png|jpe?g|webp|gif|avif)$/.test(path)) return 'image'
  return 'external' // a web page: many sites block embedding, so link out instead
}

export default function CertificateViewer({ title, url, onClose }: { title: string; url: string; onClose: () => void }) {
  const kind = getKind(url)
  const isLocal = url.startsWith('/')
  const [status, setStatus] = useState<Status>(kind === 'external' || !isLocal ? 'ready' : 'checking')
  const [loaded, setLoaded] = useState(false)
  const canEmbedPdf = typeof navigator === 'undefined' || navigator.pdfViewerEnabled !== false

  useEffect(() => {
    if (kind === 'external' || !isLocal) return
    const ctrl = new AbortController()
    // Dev servers answer 200 with index.html for missing files, so check the content type too.
    fetch(url, { method: 'HEAD', signal: ctrl.signal })
      .then((r) => {
        const type = r.headers.get('content-type') ?? ''
        setStatus(r.ok && (type.includes('pdf') || type.startsWith('image/')) ? 'ready' : 'missing')
      })
      .catch((e) => { if (e.name !== 'AbortError') setStatus('missing') })
    return () => ctrl.abort()
  }, [url, kind, isLocal])

  const loading = (
    <p className="flex h-full items-center justify-center gap-2 text-muted" role="status">
      <Loader2 className="animate-spin" size={18} aria-hidden /> Loading certificate…
    </p>
  )

  return (
    <Modal title={`Certificate: ${title}`} titleId="certificate-title" onClose={onClose} className="sm:h-[90vh] sm:max-w-4xl">
      <div className="relative min-h-0 flex-1 bg-neutral-100">
        {status === 'checking' && loading}

        {status === 'missing' && (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="font-display text-xl font-bold">This certificate is temporarily unavailable.</p>
            <p className="max-w-sm text-muted">Please check back soon.</p>
          </div>
        )}

        {status === 'ready' && kind === 'image' && (
          <div className="h-full overflow-auto p-4">
            <img src={url} alt={`Certificate for ${title}`} className="mx-auto max-h-full max-w-full object-contain"
              onError={() => setStatus('missing')} />
          </div>
        )}

        {status === 'ready' && kind === 'pdf' && canEmbedPdf && (
          <>
            {!loaded && <div className="absolute inset-0">{loading}</div>}
            <iframe title={`Certificate for ${title}`} src={url} onLoad={() => setLoaded(true)}
              className="relative h-full w-full border-0 bg-white" />
          </>
        )}

        {status === 'ready' && (kind === 'external' || (kind === 'pdf' && !canEmbedPdf)) && (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="max-w-sm text-muted">This certificate opens in a new tab. Use the link below.</p>
          </div>
        )}
      </div>

      {status === 'ready' && (
        <footer className="flex items-center justify-center border-t border-line px-4 py-3 text-sm">
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 font-semibold underline underline-offset-4">
            Open in new tab <ExternalLink size={14} aria-hidden />
          </a>
        </footer>
      )}
    </Modal>
  )
}