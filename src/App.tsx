import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { isMobile, isPWA } from './lib/deviceDetection'
import { InstallLanding } from './components/InstallLanding'
import { AuthLanding } from './components/AuthLanding'
import Events from './Events'
import User from './User'
import Navigation from './Navigation'

function App() {
  const { user, loading } = useAuth()
  const [showModal, setShowModal] = useState(false)

  // 1. Mobile Browser Gate
  if (isMobile() && !isPWA()) {
    return <InstallLanding />
  }

  // Handle auth loading state before checking user
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1B5E20', color: 'white' }}>
        <h2>Loading...</h2>
      </div>
    )
  }

  // 2. Authentication Gate
  if (!user) {
    return <AuthLanding />
  }

  // 3. Application State
  return (
    <div className="min-h-screen bg-gray-50 pb-20"> {/* pb-20 for bottom nav space */}
      <Routes>
        <Route path="/" element={<Events showModal={showModal} setShowModal={setShowModal} />} />
        <Route path="/profile" element={<User />} />
      </Routes>
      <Navigation onAddClick={() => setShowModal(true)} />
    </div>
  )
}

export default App
