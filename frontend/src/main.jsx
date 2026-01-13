import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { GigProvider } from './context/GigContext.jsx'

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <AuthProvider>
      <GigProvider>
             <App />
      </GigProvider>
    </AuthProvider>
    </BrowserRouter>
  
)
