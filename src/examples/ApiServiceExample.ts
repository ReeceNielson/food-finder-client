/**
 * Example usage of ApiService and useApi hook
 */

// ============================================
// Using the useApi hook (Recommended)
// ============================================

import { useEffect, useState } from 'react'
import { useApi } from '@/hooks/useApi'

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
}

function EventsList() {
  const api = useApi()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get<Event[]>('/api/events/')
        if (response.success) {
          setEvents(response.data || [])
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    if (api.isAuthenticated) {
      fetchEvents()
    }
  }, [api])

  // ... rest of component
}

// ============================================
// Creating a new event with POST
// ============================================

async function createEvent(eventData: Omit<Event, 'id'>) {
  const api = useApi()

  const response = await api.post<Event>('/api/events/', eventData)

  if (response.success) {
    console.log('Event created:', response.data)
  } else {
    console.error('Error creating event:', response.error)
  }
}

// ============================================
// Updating user settings with PUT
// ============================================

async function updateUserSettings(settings: {
  notifications_enabled: boolean
  event_preferences: string[]
}) {
  const api = useApi()

  const response = await api.put('/api/user/', settings)

  if (response.success) {
    console.log('Settings updated successfully')
  } else {
    console.error('Error updating settings:', response.error)
  }
}

// ============================================
// Deleting a resource with DELETE
// ============================================

async function deleteEvent(eventId: number) {
  const api = useApi()

  const response = await api.delete(`/api/events/${eventId}/`)

  if (response.success) {
    console.log('Event deleted successfully')
  } else {
    console.error('Error deleting event:', response.error)
  }
}

// ============================================
// Getting user profile with GET
// ============================================

async function getUserProfile() {
  const api = useApi()

  const response = await api.get('/api/user/')

  if (response.success) {
    console.log('User profile:', response.data)
    return response.data
  } else {
    console.error('Error fetching user profile:', response.error)
  }
}

// ============================================
// Using ApiService directly (without hook)
// ============================================

import { apiService } from '@/services/ApiService'

// If you have a token from another source:
async function fetchWithToken(token: string) {
  const response = await apiService.get('/api/events/', token)
  return response.data
}

// ============================================
// Error Handling Examples
// ============================================

async function exampleWithErrorHandling() {
  const api = useApi()

  try {
    const response = await api.post('/api/events/', {
      title: 'My Event',
      date: '2026-03-15',
    })

    if (!response.success) {
      if (response.status === 401) {
        console.error('Unauthorized - Please log in')
      } else if (response.status === 400) {
        console.error('Bad request - Invalid data')
      } else {
        console.error(`Error: ${response.error}`)
      }
      return
    }

    console.log('Success:', response.data)
  } catch (error) {
    console.error('Network error:', error)
  }
}

export {
  createEvent,
  updateUserSettings,
  deleteEvent,
  getUserProfile,
  fetchWithToken,
  exampleWithErrorHandling,
  EventsList,
}
