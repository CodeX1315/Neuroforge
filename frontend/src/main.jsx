import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 3500,
              className: 'nf-toast',
              style: {
                background: 'var(--bg-raised)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontFamily: 'Inter, system-ui, sans-serif',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              },
              success: { iconTheme: { primary: '#3f8f5f', secondary: 'white' } },
              error: { iconTheme: { primary: '#c4432e', secondary: 'white' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
