import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('No #root element found')

const splash = document.getElementById('splash')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    if (splash) {
      splash.style.opacity = '0'
      splash.style.pointerEvents = 'none'
      setTimeout(() => splash.remove(), 400)
    }
  })
})
