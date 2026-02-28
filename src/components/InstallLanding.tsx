import { getOS } from '../lib/deviceDetection'

export function InstallLanding() {
    const os = getOS()

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1B5E20] to-[#0F3311] text-white p-8 font-sans text-center">
            <div className="max-w-lg bg-white/5 p-12 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)_inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md border border-white/10">
                <h1 className="text-[2.5rem] tracking-tight text-[#F5A623] mb-4">🍽️ Food Finder</h1>
                <h2 className="text-2xl font-bold mb-4">Install App to Continue</h2>
                <p className="text-[#C8E6C9] text-lg mb-10 leading-relaxed">
                    For the best experience, please install this application on your home screen.
                </p>

                <div className="text-left bg-black/20 p-6 rounded-xl border border-white/5">
                    {os === 'ios' && (
                        <div className="mb-4">
                            <h3 className="text-[#81C784] mb-4 text-xl font-semibold">To install on iOS:</h3>
                            <ol className="pl-6 text-gray-200 list-decimal">
                                <li className="mb-3 leading-relaxed text-lg">Tap the <strong>Share</strong> button at the bottom of Safari (<span className="inline-block align-middle bg-white/10 px-2 py-0.5 rounded-md text-base">⬇️</span>)</li>
                                <li className="mb-3 leading-relaxed text-lg">Scroll down and tap <strong>Add to Home Screen</strong> (<span className="inline-block align-middle bg-white/10 px-2 py-0.5 rounded-md text-base">➕</span>)</li>
                                <li className="mb-3 leading-relaxed text-lg">Tap <strong>Add</strong> in the top right corner.</li>
                            </ol>
                        </div>
                    )}

                    {os === 'android' && (
                        <div className="mb-4">
                            <h3 className="text-[#81C784] mb-4 text-xl font-semibold">To install on Android:</h3>
                            <ol className="pl-6 text-gray-200 list-decimal">
                                <li className="mb-3 leading-relaxed text-lg">Tap the <strong>Menu</strong> icon (three dots) in the top right corner</li>
                                <li className="mb-3 leading-relaxed text-lg">Tap <strong>Install App</strong> or <strong>Add to Home screen</strong></li>
                                <li className="mb-3 leading-relaxed text-lg">Follow the on-screen prompt to install.</li>
                            </ol>
                        </div>
                    )}

                    {os === 'other' && (
                        <div className="mb-4">
                            <h3 className="text-[#81C784] mb-4 text-xl font-semibold">To install:</h3>
                            <p className="text-gray-200 text-lg">Look for an "Install App" or "Add to Home Screen" option in your browser menu.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
