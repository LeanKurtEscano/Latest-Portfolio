import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Portfolio from './components/Portfolio'
import ThemeProvider from './context/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ThemeProvider>
          <Portfolio />
        </ThemeProvider>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)