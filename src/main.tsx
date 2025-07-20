import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setAuthTokenGetter } from './api/index.ts'

// Set up token getter before rendering app
setAuthTokenGetter(() => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
});

createRoot(document.getElementById('root')!).render(
    <App />
)
