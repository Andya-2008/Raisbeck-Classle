import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function mount() {
  const container = document.getElementById('root')
  if (!container) return

  // 🛡️ Prevent double execution (iframe / WP / reloads)
  if (container.__reactRoot) return

  container.__reactRoot = createRoot(container)
  container.__reactRoot.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

// ✅ Wait until iframe DOM is fully ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}