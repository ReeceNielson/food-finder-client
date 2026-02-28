import { useAuth } from '../hooks/useAuth'

export function AuthLanding() {
    const { signInWithGoogle } = useAuth()

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white p-8 font-sans">
            <div className="max-w-2xl bg-white/5 px-12 py-16 rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.4)_inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl border border-white/10 text-center">
                <div className="mb-12">
                    <h1 className="text-[3rem] font-extrabold text-white mb-4 tracking-tight drop-shadow-md">🍽️ Food Finder</h1>
                    <p className="text-[1.2rem] text-[#C8E6C9] leading-relaxed max-w-[80%] mx-auto">
                        Discover local food gatherings, community potlucks, and culinary events near you.
                    </p>
                </div>

                <div className="flex flex-col gap-6 mb-14 text-left">
                    <div className="flex items-center gap-4 bg-black/20 p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/30">
                        <span className="text-[1.8rem]">📍</span>
                        <p className="text-[1.1rem] font-medium text-gray-200 m-0">Find hidden gems in your neighborhood</p>
                    </div>
                    <div className="flex items-center gap-4 bg-black/20 p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/30">
                        <span className="text-[1.8rem]">🤝</span>
                        <p className="text-[1.1rem] font-medium text-gray-200 m-0">Connect with local food enthusiasts</p>
                    </div>
                    <div className="flex items-center gap-4 bg-black/20 p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/30">
                        <span className="text-[1.8rem]">📅</span>
                        <p className="text-[1.1rem] font-medium text-gray-200 m-0">Host and manage your own food events</p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-10 flex justify-center">
                    <button onClick={signInWithGoogle} className="flex items-center gap-3 bg-white text-[#1B5E20] text-[1.1rem] font-semibold py-3 px-8 border-none rounded-full cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:bg-gray-50 active:translate-y-0.5">
                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    )
}
