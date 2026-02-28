import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	base: "/food-finder-client/",
	plugins: [react(), tailwindcss()],
	server: {
		// tailscale
		allowedHosts: ["kaysons-mac-mini.tail31b9df.ts.net"],
	},
});
