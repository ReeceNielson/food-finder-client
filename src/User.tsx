import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { getFcmToken } from "./lib/getFcm";
import { useApi } from './hooks/useApi'

interface UserData {
	id: string;
	notify: boolean;
	social_credit: number;
	event_types: string[];
	event_ids: string[];
	created_at: string;
	fcm_token: string | null;
	tier: string;
}

interface UserDataResponse {
	user_data: UserData[];
}

const EVENT_TYPES = [
	{ id: "free_food", label: "Free Food" },
	{ id: "tech_talk", label: "Tech Talk" },
	{ id: "potluck", label: "Potluck" },
	{ id: "food_truck", label: "Food Truck Rally" },
	{ id: "cooking_workshop", label: "Cooking Workshop" },
	{ id: "restaurant_promo", label: "Restaurant Promotion" },
	{ id: "farmers_market", label: "Farmers Market" },
	{ id: "bbq", label: "BBQ" },
	{ id: "catering", label: "Catering" },
];

interface UserProps {
	setShowModal: (show: boolean) => void;
}

function User({ setShowModal: _setShowModal }: UserProps) {
  const { user: authUser, loading: authLoading, signOut } = useAuth()
  const api = useApi()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
const [fcmToken, setFcmToken] = useState<string | null>(null);


	useEffect(() => {
		if (authUser) {
			fetchUserData();
		}
	}, [authUser]);

  const fetchUserData = async () => {
    try {
      const response = await api.get<UserDataResponse>('/profile/')
      if (response.success) {
        const userData = (response.data as UserDataResponse).user_data[0]
        setUser(userData)
        setNotificationsEnabled(userData.notify)
        setSelectedEventTypes(userData.event_types || [])
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

	const handleEventTypeToggle = (eventType: string) => {
		setSelectedEventTypes((prev: string[]) =>
			prev.includes(eventType)
				? prev.filter((t: string) => t !== eventType)
				: [...prev, eventType],
		);
	};

	const handleSaveSettings = async () => {
		setSaving(true);
		setMessage("");

    try {
      const response = await api.post<UserData>('/profile/', {
        notify: notificationsEnabled,
        event_types: selectedEventTypes,
      })

			if (response.success) {
				setMessage("Settings saved successfully!");
				setTimeout(() => setMessage(""), 3000);
			} else {
				setMessage("Error saving settings");
			}
		} catch (error) {
			console.error("Error saving settings:", error);
			setMessage("Error saving settings. Please try again.");
			setTimeout(() => setMessage(""), 3000);
		} finally {
			setSaving(false);
		}
	};

	if (authLoading || loading) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-8">
				<header className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center text-[#1B5E20]">
					<h1 className="text-3xl font-extrabold m-0">Loading...</h1>
				</header>
			</div>
		);
	}

	if (!authUser) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-8">
				<header className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-[#1B5E20]">
					<h1 className="text-3xl font-extrabold m-0">Profile Settings</h1>
				</header>
				<main>
					<div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center font-medium">
						<p className="m-0">Please sign in to view your profile.</p>
					</div>
				</main>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-8">
				<header className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-[#1B5E20]">
					<h1 className="text-3xl font-extrabold m-0">User Profile</h1>
				</header>
				<main>
					<div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center font-medium">
						<p className="m-0">
							Unable to load user profile. Please try again later.
						</p>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<header className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center text-[#1B5E20] gap-4">
				<div>
					<h1 className="text-3xl font-extrabold m-0">Profile Settings</h1>
					<p className="text-[#2E7D32] text-lg m-0 mt-1">
						Manage your preferences
					</p>
				</div>
			</header>

			<main className="flex flex-col gap-8">
				<section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
					<div className="p-8 flex-2">
						<button
							type="button"
							className="bg-[#2E7D32] text-white px-4 py-2 rounded-xl"
							onClick={async () => {
								const result = await getFcmToken();
								if (result.success && result.token) {
									setFcmToken(result.token);
									const response = await api.post('/profile/', {
										fcm_token: result.token,
									} as Record<string, unknown>);
									if (response.success) {
										setMessage('FCM token saved successfully!');
										setTimeout(() => setMessage(''), 3000);
									} else {
										setMessage('Error saving FCM token');
										setTimeout(() => setMessage(''), 3000);
									}
								} else {
									setFcmToken(null);
								}
							}}
						>
							Get FCM Token
						</button>
						{fcmToken && (
							<div className="mt-4">
								<p className="text-sm font-medium text-[#2E7D32]">FCM Token:</p>
								<div className="text-xs text-[#1B5E20] bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 overflow-x-auto">
									{fcmToken}
								</div>
							</div>
						)}
					</div>
				</section>
				{/* User Information Card */}
				<section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
					<div className="p-8 flex-2">
						<h2 className="text-xl font-bold text-[#1B5E20] mb-6 border-b border-gray-100 pb-3">
							Your Information
						</h2>
						<div className="flex flex-col gap-5 text-left">
							<div className="flex flex-col gap-1.5">
								<label className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
									Email
								</label>
								<div className="text-lg font-medium text-[#1B5E20] bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
									{authUser.email}
								</div>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
									Tier
								</label>
								<div className="text-lg font-medium text-[#1B5E20] bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 capitalize">
									{user.tier}
								</div>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
									Member Since
								</label>
								<div className="text-lg font-medium text-[#1B5E20] bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
									{new Date(user.created_at).toLocaleDateString()}
								</div>
							</div>
						</div>
					</div>

					{/* Social Credit Card */}
					<div className="bg-gradient-to-br from-[#81C784] to-[#C8E6C9] p-8 flex-1 flex items-center justify-center text-white text-center">
						<div className="flex flex-col items-center">
							<h3 className="text-lg font-semibold mb-2 opacity-90 m-0">
								Social Credit
							</h3>
							<div className="text-6xl font-black my-4 text-white drop-shadow-md">
								{user.social_credit}
							</div>
							<p className="text-sm opacity-90 mt-2 m-0 max-w-[200px]">
								Your reputation score in the community
							</p>
						</div>
					</div>
				</section>

				{/* Settings Section */}
				<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
					<h2 className="text-xl font-bold text-[#1B5E20] mb-6 border-b border-gray-100 pb-3">
						Notification Settings
					</h2>

					<div className="flex justify-between items-center py-3">
						<div className="flex-1">
							<label
								htmlFor="notifications"
								className="block text-lg font-semibold text-[#1B5E20] mb-1"
							>
								Receive Notifications
							</label>
							<p className="text-[15px] text-gray-500 m-0">
								Get notified about new events
							</p>
						</div>
						{/* Toggle Switch */}
						<div className="relative inline-block w-14 h-8 shrink-0">
							<input
								id="notifications"
								type="checkbox"
								checked={notificationsEnabled}
								onChange={(e) => setNotificationsEnabled(e.target.checked)}
								className="opacity-0 w-0 h-0 peer"
							/>
							<span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition-colors duration-400 rounded-[34px] peer-checked:bg-[#F5A623] before:absolute before:content-[''] before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:transition-transform before:duration-400 before:rounded-full peer-checked:before:translate-x-6 shadow-inner"></span>
						</div>
					</div>
				</section>

				{/* Event Preferences Section */}
				<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
					<h2 className="text-xl font-bold text-[#1B5E20] mb-2">
						Event Type Preferences
					</h2>
					<p className="text-[15px] text-gray-500 mb-6 pb-4 border-b border-gray-100">
						Select which types of events interest you
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{EVENT_TYPES.map((eventType) => (
							<div
								key={eventType.id}
								className="relative flex items-center p-3 rounded-xl border border-gray-200 transition-all duration-200 hover:border-[#81C784] hover:bg-[#81C784]/5 focus-within:ring-2 focus-within:ring-[#81C784]/50 cursor-pointer text-left"
							>
								<input
									id={eventType.id}
									type="checkbox"
									checked={selectedEventTypes.includes(eventType.id)}
									onChange={() => handleEventTypeToggle(eventType.id)}
									className="w-5 h-5 text-[#81C784] bg-white border-gray-300 rounded focus:ring-[#81C784] cursor-pointer accent-[#81C784]"
								/>
								<label
									htmlFor={eventType.id}
									className="ml-3 text-base font-medium text-gray-800 cursor-pointer flex-1"
								>
									{eventType.label}
								</label>
							</div>
						))}
					</div>
				</section>

				{/* Message Display */}
				{message && (
					<div
						className={`p-4 rounded-xl text-center font-medium animate-fade-in ${message.includes("successfully") ? "bg-[#C8E6C9]/30 text-[#4a543f] border border-[#C8E6C9]" : "bg-red-50 text-red-700 border border-red-200"}`}
					>
						{message}
					</div>
				)}

				{/* Save Button */}
				<button
					className="mt-6 py-4 px-8 bg-[#F5A623] text-white border-none rounded-xl text-lg font-bold cursor-pointer transition-all duration-300 hover:bg-[#b04a29] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none w-full sm:w-auto self-center sm:self-end"
					onClick={handleSaveSettings}
					disabled={saving}
				>
					{saving ? "Saving..." : "Save Settings"}
				</button>

				{/* Sign Out Button */}
				<button
					className="mt-2 py-4 px-8 bg-white text-red-600 border border-red-200 rounded-xl text-lg font-bold cursor-pointer transition-all duration-300 hover:bg-red-50 hover:shadow-md active:translate-y-0 disabled:opacity-50 w-full sm:w-auto self-center sm:self-end"
					onClick={signOut}
				>
					Sign Out
				</button>
			</main>
		</div>
	);
}

export default User;
