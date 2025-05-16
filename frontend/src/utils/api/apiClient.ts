// import des bibliothèques
import axios from "axios";

export const apiClient = axios.create({
	// baseURL: `http://${ipAdress}:${import.meta.env.VITE_BACKEND_PORT}`,
	baseURL: `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});
