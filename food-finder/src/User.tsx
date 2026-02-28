import { useState, useEffect } from 'react'
import './User.css'

interface UserData {
  id: number
  username: string
  email: string
  social_credit: number
  notifications_enabled: boolean
  event_preferences: string[]
}

const EVENT_TYPES = [
  { id: 'potluck', label: 'Potluck' },
  { id: 'food-truck', label: 'Food Truck Rally' },
  { id: 'cooking-workshop', label: 'Cooking Workshop' },
  { id: 'restaurant-promo', label: 'Restaurant Promotion' },
  { id: 'farmers-market', label: 'Farmers Market' },
  { id: 'bbq', label: 'BBQ' },
  { id: 'catering', label: 'Catering' },
]

function User() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/user/')
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setNotificationsEnabled(data.notifications_enabled)
        setSelectedEventTypes(data.event_preferences || [])
      }
    } catch (error) {
      console.log(
        'Using sample user data for development',
        error
      )
      // Sample data for development
      const sampleUser: UserData = {
        id: 1,
        username: 'foodlover',
        email: 'foodlover@example.com',
        social_credit: 150,
        notifications_enabled: true,
        event_preferences: ['potluck', 'food-truck', 'farmers-market'],
      }
      setUser(sampleUser)
      setNotificationsEnabled(sampleUser.notifications_enabled)
      setSelectedEventTypes(sampleUser.event_preferences)
    } finally {
      setLoading(false)
    }
  }

  const handleEventTypeToggle = (eventType: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(eventType)
        ? prev.filter((t) => t !== eventType)
        : [...prev, eventType]
    )
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/user/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifications_enabled: notificationsEnabled,
          event_preferences: selectedEventTypes,
        }),
      })

      if (response.ok) {
        setMessage('Settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Error saving settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Error saving settings. Please try again.')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="user-container">
        <header className="user-header">
          <h1>Loading...</h1>
        </header>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="user-container">
        <header className="user-header">
          <h1>User Profile</h1>
        </header>
        <main className="user-content">
          <div className="error-state">
            <p>Unable to load user profile. Please try again later.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="user-container">
      <header className="user-header">
        <h1>Profile Settings</h1>
        <p className="header-subtitle">Manage your preferences</p>
      </header>

      <main className="user-content">
        {/* User Information Card */}
        <section className="user-info-card">
          <div className="info-section">
            <h2>Your Information</h2>
            <div className="info-fields">
              <div className="info-field">
                <label>Username</label>
                <div className="info-value">{user.username}</div>
              </div>
              <div className="info-field">
                <label>Email</label>
                <div className="info-value">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Social Credit Card */}
          <div className="social-credit-card">
            <div className="credit-content">
              <h3>Social Credit</h3>
              <div className="credit-score">{user.social_credit}</div>
              <p className="credit-description">
                Your reputation score in the community
              </p>
            </div>
          </div>
        </section>

        {/* Settings Section */}
        <section className="settings-section">
          <h2>Notification Settings</h2>

          <div className="setting-item">
            <div className="setting-label">
              <label htmlFor="notifications">Receive Notifications</label>
              <p className="setting-description">
                Get notified about new events
              </p>
            </div>
            <div className="toggle-switch">
              <input
                id="notifications"
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
        </section>

        {/* Event Preferences Section */}
        <section className="preferences-section">
          <h2>Event Type Preferences</h2>
          <p className="section-description">
            Select which types of events interest you
          </p>

          <div className="event-types-grid">
            {EVENT_TYPES.map((eventType) => (
              <div key={eventType.id} className="event-type-item">
                <input
                  id={eventType.id}
                  type="checkbox"
                  checked={selectedEventTypes.includes(eventType.id)}
                  onChange={() => handleEventTypeToggle(eventType.id)}
                />
                <label htmlFor={eventType.id}>{eventType.label}</label>
              </div>
            ))}
          </div>
        </section>

        {/* Message Display */}
        {message && (
          <div
            className={`message ${message.includes('successfully') ? 'success' : 'error'}`}
          >
            {message}
          </div>
        )}

        {/* Save Button */}
        <button
          className="save-settings-btn"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </main>
    </div>
  )
}

export default User
