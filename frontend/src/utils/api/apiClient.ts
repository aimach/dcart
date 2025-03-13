// import des bibliothèques
import axios from "axios";
import { refreshToken } from "./authAPI";

export const apiClient = axios.create({
	baseURL: `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});

// intercepteur pour rafraîchir le token d'accès si nécessaire
apiClient.interceptors.response.use(
	(response) => response, // si la requête réussit, on la retourne
	async (error) => {
		if (error.response?.status === 401) {
			try {
				const newAccessToken = await refreshToken();
				apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
				return apiClient(error.config); // Rejouer la requête avec le nouveau token
			} catch (refreshError) {
				console.error("Session expirée");
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);
