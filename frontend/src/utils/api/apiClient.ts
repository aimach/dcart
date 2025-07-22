// import des bibliothèques
import axios from "axios";

export const apiClient = axios.create({
	baseURL: import.meta.env.DEV
		? `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`
		: `https://${import.meta.env.VITE_BACKEND_HOST_PROD}`,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});
