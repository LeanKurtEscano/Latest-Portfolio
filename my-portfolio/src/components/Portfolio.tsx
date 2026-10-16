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

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // short delay so the homepage sections are mounted before scrolling
      const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 50)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
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