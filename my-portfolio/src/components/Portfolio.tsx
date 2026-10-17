import { useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Contact from './sections/Contact'
import ResumeViewer from './ResumeViewer'
import Certifications from './sections/Certifications'
import Awards from './sections/Awards'
import ProjectsPage from './pages/ProjectsPage'
import { scrollToSection } from '../lib'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // no hash: normal page change, jump to top
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const id = hash.slice(1)
    let tries = 0
    let raf = 0

    // start from the top so the scroll doesn't begin mid-page from /projects
    window.scrollTo(0, 0)

    const attempt = () => {
      if (document.getElementById(id)) {
        scrollToSection(id)
        return
      }
      // section not mounted yet, keep retrying for ~1s
      if (tries++ < 60) raf = requestAnimationFrame(attempt)
    }

    // small delay lets the new route mount and settle first
    const t = setTimeout(() => {
      raf = requestAnimationFrame(attempt)
    }, 100)

    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [pathname, hash])

  return null
}

function Home({ onViewResume }: { onViewResume: () => void }) {
  return (
    <>
      <Hero onViewResume={onViewResume} />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Awards />
      <Certifications />
      <Contact />
    </>
  )
}

export default function Portfolio() {
  const [resumeOpen, setResumeOpen] = useState(false)
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="*" element={<Home onViewResume={() => setResumeOpen(true)} />} />
        </Routes>
      </main>
      <Footer />
      <AnimatePresence>{resumeOpen && <ResumeViewer onClose={() => setResumeOpen(false)} />}</AnimatePresence>
    </>
  )
}