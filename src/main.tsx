import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Navigation from './Navigation.tsx'
import App from './App.tsx'
import User from './User.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<User />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
