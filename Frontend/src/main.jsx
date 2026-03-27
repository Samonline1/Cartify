import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from "./AuthContext";


createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>
          <App/>
        <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '20px',
          },
        }}
      />
        </AuthProvider>
  </StrictMode>,
)
