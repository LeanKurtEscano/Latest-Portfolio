import { motion } from 'motion/react'
import { FileText } from 'lucide-react'
import SafeImage from '../ui/SafeImage'
import { siteConfig } from '../../constants/site'
import { scrollToSection } from '../../lib'

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function Hero({ onViewResume }: { onViewResume: () => void }) {
  const { hero, name, title,profileImage} = siteConfig

  return (
    <section id="home" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:py-28">
      <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.1 }}>
        <motion.p variants={item} className="text-sm font-semibold text-muted">{hero.label}</motion.p>
        <motion.h1 variants={item} className="mt-5 font-display text-[clamp(2.4rem,7.2vw,5.5rem)] font-extrabold leading-[0.98] tracking-tight [overflow-wrap:anywhere]">
          {hero.headline}
        </motion.h1>
        <motion.p variants={item} className="mt-7 max-w-xl text-lg leading-relaxed text-muted">{hero.description}</motion.p>
        <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
          <button className="btn btn-solid" onClick={() => scrollToSection('projects')}>View My Projects</button>
          <button className="btn btn-outline" onClick={onViewResume} aria-haspopup="dialog">
            <FileText size={16} aria-hidden /> View Resume
          </button>
          <button className="btn btn-outline" onClick={() => scrollToSection('contact')}>Contact Me</button>
        </motion.div>
      </motion.div>

      <motion.figure
        className="relative mx-auto w-full max-w-sm lg:max-w-none"
        initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
        animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-md border border-ink" />
        <SafeImage
          src={profileImage}
          alt={`Portrait of ${name}, ${title}`}
          fallbackLabel={name}
          width={800} height={1000}
          fetchPriority="high"
          className="relative aspect-[4/5] w-full rounded-md  object-cover "
        />
      </motion.figure>
    </section>
  )
}
