import { Link, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

interface NavigationProps {
  onAddClick: () => void;
}

function Navigation({ onAddClick }: NavigationProps) {
  const location = useLocation()
  const { user } = useAuth()

  // Only show navigation for authenticated users
  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-[#F5A623]' : 'text-gray-500 hover:text-gray-800'
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 pb-safe">
      <div className="flex justify-between items-center h-[68px] max-w-md mx-auto relative px-10">

        {/* Events Link */}
        <Link to="/" className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${isActive('/')}`}>
          <span className="text-2xl">🏠</span>
          <span className="text-[11px] font-bold tracking-wide">Events</span>
        </Link>

        {/* Floating Action Button (Center Cutout) */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2">
          {/* White ring wrapper creates the cutout illusion */}
          <div className="bg-white rounded-full p-2 shadow-[0_-8px_10px_-4px_rgba(0,0,0,0.05)]">
            <button
              onClick={onAddClick}
              className="flex items-center justify-center w-14 h-14 bg-[#1B5E20] text-white rounded-full shadow-md transform transition-transform duration-200 active:scale-95 hover:bg-[#403d46]"
              title="Create Event"
            >
              <span className="text-3xl font-light leading-none mb-1">+</span>
            </button>
          </div>
        </div>

        {/* Profile Link */}
        <Link to="/profile" className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${isActive('/profile')}`}>
          <span className="text-2xl">👤</span>
          <span className="text-[11px] font-bold tracking-wide">Profile</span>
        </Link>

      </div>
    </div>
  )
}

export default Navigation
