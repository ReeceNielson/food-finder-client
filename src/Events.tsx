import { useState, useEffect } from 'react'
import { useApi } from './hooks/useApi'

interface Event {
  id: string          // uuid, not number
  title: string
  description: string
  date: string
  time: string
  location: string
  types: string[]     // was event_type?: string
  is_expired: boolean
  notification_sent: boolean
}

interface EventsResponse {
  events: Event[]
}

interface EventsProps {
  refreshTrigger: number
}

function Events({ refreshTrigger: _refreshTrigger }: EventsProps) {
  const api = useApi()
  const [events, setEvents] = useState<Event[]>([])

  const fetchEvents = async () => {
    try {
      const response = await api.get<EventsResponse>('/events/')
      if (response.success) {
        const eventList = (response.data as EventsResponse).events || []
        setEvents(eventList)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  // Fetch events from server
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents()
  }, [])

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

    </div>
  )
}

export default Events
