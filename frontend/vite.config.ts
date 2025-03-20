import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000, // on définit le port à 3000
		host: true,
		watch: {
			usePolling: true,
		},
	},
	css: {
		modules: {
			scopeBehaviour: "local", // Utilise des classes locales par défaut
			localsConvention: "camelCase", // Convertit les noms de classe en camelCase
		},
		preprocessorOptions: {
			scss: {
				additionalData: `@use "src/styles/variable" as *; @use "src/styles/mixin" as *;`,
			},
		},
	},
	resolve: {
		alias: {
			"leaflet-side-by-side": path.resolve(
				__dirname,
				"src/utils/patch-library/leaflet-side-by-side.js",
			),
		},
	},
});
