// import des services
import { apiClient } from "./apiClient";
// import des types
import type { User } from "../types/userTypes";

/**
 * Récupération du profile de l'utilisateur
 * @param accessToken - Token d'accès
 * @returns le profile de l'utilisateur
 */
const getProfile = async (accessToken: string) => {
	try {
		const response = await apiClient.get("/auth/profile", {
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des données de l'utilisateur :",
			error,
		);
	}
};

/**
 * Fonction de connexion de l'utilisateur
 * @param body - les données de connexion
 * @returns booléan
 */
const loginUser = async (body: User) => {
	try {
		const loginUserResponse = await apiClient.post("/auth/login", body, {
			withCredentials: true,
		});
		if (loginUserResponse.status === 200) {
			return true;
		}
		return false;
	} catch (error) {
		console.error("Erreur lors de la connexion de l'utilisateur :", error);
	}
};

/**
 * Fonction de rafraichissement du token d'accès
 * @returns le nouveau token d'accès
 */
const refreshToken = async () => {
	try {
		const response = await apiClient.post(
			"/auth/refresh-token",
			{},
			{ withCredentials: true },
		);
		return response.data.accessToken;
	} catch (error) {
		console.error("Erreur lors du rafraîchissement du jeton :", error);
	}
};

export { loginUser, getProfile, refreshToken };
