import { useState } from 'react';
import { getFcmToken } from '../lib/getFcm';

interface NotificationPromptProps {
    onComplete: () => void;
}

export function NotificationPrompt({ onComplete }: NotificationPromptProps) {
    const [preference, setPreference] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleEnable = async () => {
        if (preference === null) return;
        setLoading(true);
        try {
            const result = await getFcmToken();
            if (result.success) {
                console.log("FCM Token earned:", result.token, "Preference:", preference);
                // TODO: Upsert token and preference to Supabase here
                onComplete();
            } else {
                console.error("Failed to get token:", result.message);
                // For dev ease, let's close it even if permission denied, 
                // or maybe let them explicitly click "Maybe Later"
                if (result.message === 'permission_denied') {
                    alert("You must allow notifications in your browser settings to continue.");
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
                <div className="p-6 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-center">
                    <h2 className="text-2xl font-bold m-0 tracking-wide">Stay Updated 🍕</h2>
                    <p className="mt-2 text-[#C8E6C9] text-sm font-medium">Get notified about nearby food!</p>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-[#1B5E20]">What would you like to be notified about?</h3>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setPreference(1)}
                            className={`p-4 border rounded-xl text-left transition-all ${preference === 1 ? 'border-[#F5A623] bg-[#F5A623]/10 ring-2 ring-[#F5A623]' : 'border-gray-200 hover:border-[#81C784]'}`}
                        >
                            <span className="block font-bold text-[#1B5E20] mb-1">1. Everything</span>
                            <span className="text-sm text-[#2E7D32]">Meals, snacks, and candy!</span>
                        </button>
                        <button
                            onClick={() => setPreference(2)}
                            className={`p-4 border rounded-xl text-left transition-all ${preference === 2 ? 'border-[#F5A623] bg-[#F5A623]/10 ring-2 ring-[#F5A623]' : 'border-gray-200 hover:border-[#81C784]'}`}
                        >
                            <span className="block font-bold text-[#1B5E20] mb-1">2. Meals & Snacks</span>
                            <span className="text-sm text-[#2E7D32]">Keep it to the main stuff and some snacks.</span>
                        </button>
                        <button
                            onClick={() => setPreference(3)}
                            className={`p-4 border rounded-xl text-left transition-all ${preference === 3 ? 'border-[#F5A623] bg-[#F5A623]/10 ring-2 ring-[#F5A623]' : 'border-gray-200 hover:border-[#81C784]'}`}
                        >
                            <span className="block font-bold text-[#1B5E20] mb-1">3. Just Meals</span>
                            <span className="text-sm text-[#2E7D32]">Only the big events.</span>
                        </button>
                    </div>

                    <button
                        onClick={handleEnable}
                        disabled={preference === null || loading}
                        className="mt-4 w-full py-4 rounded-xl font-bold text-white bg-[#F5A623] hover:bg-[#b04a29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:translate-y-0.5"
                    >
                        {loading ? 'Enabling...' : 'Enable Notifications'}
                    </button>
                </div>
            </div>
        </div>
    )
}
