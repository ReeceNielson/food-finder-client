import { useState, useEffect } from 'react'
import { useApi } from './hooks/useApi'

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
}

interface EventsProps {
  showModal: boolean
  setShowModal: (show: boolean) => void
}

function Events({ showModal, setShowModal }: EventsProps) {
  const api = useApi()
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  })

  const fetchEvents = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await api.get<Event[]>('/events/')
      if (response.success) {
        const eventList = response.data || []
        setEvents(eventList)
      }
    } catch (error) {
      console.log('Loading with sample data', error)
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

  // Fetch events from server
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents()
  }, [])

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert('Please fill in required fields')
      return
    }

    try {
      const response = await api.post('/events/', newEvent)

      if (response.success) {
        setEvents([...events, response.data as Event])
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-[#1B5E20] mb-2 tracking-tight">Food Events</h1>
        <p className="text-lg text-[#2E7D32]">Discover local food gatherings</p>
      </header>

      <main className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No events yet. Create one to get started!</p>
            </div>
          ) : (
            events.map((event: Event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden hover:-translate-y-1">
                <div className="bg-gradient-to-r from-[#81C784] to-[#C8E6C9] p-4 text-white">
                  <h2 className="text-xl font-bold m-0">{event.title}</h2>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-gray-600 mb-6 flex-grow">{event.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3 bg-gray-50 p-2 rounded-md">
                    <span className="flex items-center gap-1">📅 {event.date}</span>
                    <span className="flex items-center gap-1">🕐 {event.time}</span>
                  </div>
                  <div className="text-sm font-medium text-[#F5A623] flex items-center gap-1">
                    <span>📍 {event.location}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

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
      )
      }
    </div >
  )
}

export default Events
