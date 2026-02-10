import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Entry point of the React application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Main App Component wrapped in StrictMode for development checks */}
    <App />
  </StrictMode>,
)
