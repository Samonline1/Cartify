import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from "./AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-left"
          toastOptions={{
            className: "cartify-toast",
            success: {
              className: "cartify-toast cartify-toast-success",
              iconTheme: {
                primary: "#2563eb",
                secondary: "#facc15",
              },
            },
            error: {
              className: "cartify-toast cartify-toast-error",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
