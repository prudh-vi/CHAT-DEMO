import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from "./components/ui/themeprovider.tsx"
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <App />
  </ThemeProvider>
  </BrowserRouter>,
)
