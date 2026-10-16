import { useState } from 'react'
import type { ImgHTMLAttributes } from 'react'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallbackLabel?: string
}

/** Image that shows a neutral placeholder if the file is missing, instead of a broken icon. */
export default function SafeImage({ src, alt, fallbackLabel, className = '', ...rest }: Props) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-neutral-100 text-neutral-400 ${className}`}>
        <span className="px-4 text-center font-display text-lg font-bold">{fallbackLabel ?? alt}</span>
      </div>
    )
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />
}
