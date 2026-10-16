import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Portfolio from './components/Portfolio'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Portfolio />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)