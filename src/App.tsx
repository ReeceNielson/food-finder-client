import { useState, useEffect } from 'react'
import './App.css'

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
}

function App() {
  const [events, setEvents] = useState<Event[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  })

  // Fetch events from server
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/events/')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.log('Loading with sample data')
      // Sample data for development
      setEvents([
        {
          id: 1,
          title: 'Community Potluck',
          description: 'Join us for a delicious community potluck dinner',
          date: '2026-03-15',
          time: '18:00',
          location: 'Central Park',
        },
        {
          id: 2,
          title: 'Food Truck Rally',
          description: 'Amazing food trucks from around the city',
          date: '2026-03-20',
          time: '12:00',
          location: 'Downtown Plaza',
        },
        {
          id: 3,
          title: 'Cooking Workshop',
          description: 'Learn to cook international cuisines',
          date: '2026-03-25',
          time: '19:30',
          location: 'Community Center',
        },
      ])
    }
  }

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
        const createdEvent = await response.json()
        setEvents([...events, createdEvent])
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

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Food Events</h1>
        <p className="subtitle">Discover local food gatherings</p>
      </header>

      <main className="events-container">
        <div className="events-list">
          {events.length === 0 ? (
            <div className="empty-state">
              <p>No events yet. Create one to get started!</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h2>{event.title}</h2>
                </div>
                <div className="event-details">
                  <p className="event-description">{event.description}</p>
                  <div className="event-info">
                    <span className="event-date">📅 {event.date}</span>
                    <span className="event-time">🕐 {event.time}</span>
                  </div>
                  <div className="event-location">
                    <span>📍 {event.location}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <button className="create-event-btn" onClick={() => setShowModal(true)}>
        + Create Event
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Event</h2>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form className="event-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="title">Event Title *</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Describe your event"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time *</label>
                  <input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  placeholder="Where is the event?"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-submit"
                  onClick={handleCreateEvent}
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
