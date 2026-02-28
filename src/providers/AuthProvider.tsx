import { useEffect, useState, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

import { AuthContext } from "../contexts/AuthContext";

const clientUrl = import.meta.env.VITE_CLIENT_URL;

if (!clientUrl) {
	throw new Error(
		"VITE_CLIENT_URL is not defined (this is the url for your current env, either github pages, localhost, or tailscale)",
	);
}

console.log("clientUrl", clientUrl);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signInWithGoogle = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: clientUrl,
				},
			});
			if (error) throw error;
		} catch (error) {
			console.error("Error signing in with Google:", error);
			alert("Error signing in. Please try again.");
		}
	};

	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, session, loading, signInWithGoogle, signOut }}
		>
			{children}
		</AuthContext.Provider>
	);
}
