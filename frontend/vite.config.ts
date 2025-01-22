import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
});
