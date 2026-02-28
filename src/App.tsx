import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { isMobile, isPWA } from './lib/deviceDetection'
import { InstallLanding } from './components/InstallLanding'
import { AuthLanding } from './components/AuthLanding'
import { NotificationPrompt } from './components/NotificationPrompt'
import Events from './Events'
import User from './User'
import Navigation from './Navigation'

function App() {
  const { user, loading } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [eventRefreshTrigger, setEventRefreshTrigger] = useState(0)

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  })

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert('Please fill in required fields')
      return
    }

    try {
      const response = await fetch('/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      })

      if (response.ok) {
        setEventRefreshTrigger(prev => prev + 1)
        setShowModal(false)
        setNewEvent({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
        })
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Error creating event')
    }
  }

  // Notification Modal State
  const [userDataLoading, setUserDataLoading] = useState(true)
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(true)

  useEffect(() => {
    if (user && !loading) {
      // Simulate fetching user data from Supabase 
      // (Pre-req for checking if FCM_token is null)
      const fetchUserData = async () => {
        setUserDataLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500)) // 1.5s simulated delay

        // Simulating the user passing the FCM check (FCM_token is null, mobile device)
        const isFcmTokenNull = true
        if (isFcmTokenNull && isMobile()) {
          setShowNotificationPrompt(true)
        }
        setUserDataLoading(false)
      }
      fetchUserData()
    }
  }, [user, loading])

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

  // 3. Enable notifications 
  if (userDataLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1B5E20', color: 'white' }}>
        <h2>Loading Profile...</h2>
      </div>
    )
  }

  // 4. Application State
  return (
    <div className="min-h-screen bg-gray-50 pb-20"> {/* pb-20 for bottom nav space */}
      {showNotificationPrompt && <NotificationPrompt onComplete={() => setShowNotificationPrompt(false)} />}

      <Routes>
        <Route path="/" element={<Events refreshTrigger={eventRefreshTrigger} />} />
        <Route path="/profile" element={<User setShowModal={setShowModal} />} />
      </Routes>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white">
              <h2 className="text-xl font-bold m-0 tracking-wide">Create New Event</h2>
              <button
                className="bg-transparent border-none text-white text-2xl cursor-pointer p-0 opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form className="p-6 overflow-y-auto flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700" htmlFor="title">Event Title <span className="text-[#F5A623]">*</span></label>
                <input
                  id="title"
                  className="p-2.5 border border-gray-300 rounded-lg text-base transition-colors focus:border-[#81C784] focus:ring-1 focus:ring-[#81C784] outline-none"
                  type="text"
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="p-2.5 border border-gray-300 rounded-lg text-base transition-colors focus:border-[#81C784] focus:ring-1 focus:ring-[#81C784] outline-none resize-y min-h-[80px]"
                  placeholder="Describe your event"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-4 sm:flex-row flex-col">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="date">Date <span className="text-[#F5A623]">*</span></label>
                  <input
                    id="date"
                    className="p-2.5 border border-gray-300 rounded-lg text-base transition-colors focus:border-[#81C784] focus:ring-1 focus:ring-[#81C784] outline-none w-full"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="time">Time <span className="text-[#F5A623]">*</span></label>
                  <input
                    id="time"
                    className="p-2.5 border border-gray-300 rounded-lg text-base transition-colors focus:border-[#81C784] focus:ring-1 focus:ring-[#81C784] outline-none w-full"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700" htmlFor="location">Location</label>
                <input
                  id="location"
                  className="p-2.5 border border-gray-300 rounded-lg text-base transition-colors focus:border-[#81C784] focus:ring-1 focus:ring-[#81C784] outline-none"
                  type="text"
                  placeholder="Where is the event?"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  className="py-2.5 px-5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold cursor-pointer transition-colors hover:bg-gray-50 active:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="py-2.5 px-5 bg-[#F5A623] border-none text-white rounded-lg font-semibold cursor-pointer transition-colors hover:bg-[#b04a29] active:bg-[#963f23]"
                  onClick={handleCreateEvent}
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Navigation onAddClick={() => setShowModal(true)} />
    </div>
  )
}

export default App
