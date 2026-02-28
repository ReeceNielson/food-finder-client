import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
	apiKey: "AIzaSyDBsDdR9VZJOALIbvu-8O-aCgkoHvPMLbI",
	authDomain: "food-finder-71e84.firebaseapp.com",
	projectId: "food-finder-71e84",
	storageBucket: "food-finder-71e84.firebasestorage.app",
	messagingSenderId: "944815549900",
	appId: "1:944815549900:web:e0a72596850625c37f4169",
};

type response_messages = "success" | "error" | "no_token" | "permission_denied";

type fcm_token_response = {
	success: boolean;
	message: response_messages;
	token?: string;
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

// Use the VAPID key from your vapid file
const VAPID_KEY =
	"BFV6fna1ilEQ2B9LNfxJdXSmxJfdZAF7l0Bm-F7YiyLxzfd9LOcgtDp7DY69GPACLOMbN2lW99yBUlWMXXoE4Fs";

export const getFcmToken = async (): Promise<fcm_token_response> => {
	try {
		const isMobile =
			/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent,
			);
		const isPwa =
			window.matchMedia("(display-mode: standalone)").matches ||
			("standalone" in navigator &&
				(navigator as Navigator & { standalone?: boolean }).standalone ===
					true);

		if (isMobile && !isPwa) {
			throw new Error(
				"Push notifications require the app to be installed as a PWA on mobile devices.",
			);
		}

		console.log("Requesting permission...");
		const permission = await Notification.requestPermission();

		if (permission === "granted") {
			console.log("Notification permission granted.");
			// Explicitly register the service worker
			const registration = await navigator.serviceWorker.register(
				"/food-finder-client/firebase-messaging-sw.js",
			);

			// Get the token, passing the service worker registration
			const currentToken = await getToken(messaging, {
				vapidKey: VAPID_KEY,
				serviceWorkerRegistration: registration,
			});
			if (currentToken) {
				console.log("FCM Token:", currentToken);
				return { success: true, message: "success", token: currentToken };
			} else {
				console.log(
					"No registration token available. Request permission to generate one.",
				);
				return { success: false, message: "no_token" };
			}
		} else {
			console.log("Notification permission not granted:", permission);
			return { success: false, message: "permission_denied" };
		}
	} catch (error) {
		console.error("An error occurred while retrieving token. ", error);
		return { success: false, message: "error" };
	}
};
