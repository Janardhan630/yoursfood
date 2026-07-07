import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Imported directly (not via CSS @import) in cascade order: tokens first,
// responsive overrides last so later rules win.
import './styles/tokens.css'
import './styles/base.css'
import './styles/buttons.css'
import './styles/layout.css'
import './styles/hero.css'
import './styles/cards.css'
import './styles/forms.css'
import './styles/controls.css'
import './styles/responsive.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,

)
