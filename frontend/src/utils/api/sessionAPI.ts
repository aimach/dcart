// import des bibliothèques
import axios from "axios";
// import des services
import { apiClient } from "./apiClient";

/**
 * Fonction de création d'une session de modification
 * @param type - Type de l'item
 * @param itemId - Id de l'item
 * @param accessToken - Token d'accès
 * @return {Promise<boolean>} - Renvoie la réponse de l'API
 */
const createSession = async (type: string, itemId: string) => {
	try {
		const response = await apiClient.post(`/session/${type}/${itemId}`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors de la création d'une session de modification :",
			error,
		);
	}
};

/**
 * Fonction de création d'une session de modification
 * @param type - Type de l'item
 * @param itemId - Id de l'item
 * @param accessToken - Token d'accès
 * @return {Promise<boolean>} - Renvoie la réponse de l'API
 */
const updateSession = async () => {
	try {
		const response = await apiClient.put("/session", {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors de la mise à jour d'une session de modification :",
			error,
		);
	}
};

/**
 * Fonction de récupération d'une session de modification
 * @param itemId - Id de l'item
 * @return {Promise<boolean>} - Renvoie true si une session est en cours, false sinon
 */
const getSessionById = async (itemId: string) => {
	try {
		const response = await apiClient.get(`/session/${itemId}`, {
			withCredentials: true,
		});
		return response;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 404) {
				// Cas attendu : utilisateur non connecté, on ignore
				return;
			}
			console.error(
				"Erreur lors de la récupération d'une session de modification :",
				error,
			);
		} else {
			// Erreur non axios (ex: problème JS)
			console.error("Erreur inattendue :", error);
		}
	}
};

/**
 * Fonction de suppression d'une session de modification
 */
const deleteSession = async () => {
	try {
		await apiClient.delete("/session", {
			withCredentials: true,
		});
	} catch (error) {
		console.error(
			"Erreur lors de la suppression de la session de modification :",
			error,
		);
	}
};

/**
 * Fonction de ping de la session de modification
 */
const pingSession = async (session: Record<string, string>) => {
	try {
		await apiClient.post(
			"/session/ping",
			{ sessionId: session.id },
			{ withCredentials: true },
		);
	} catch (error) {
		console.error("Erreur lors du ping de la session de modification :", error);
	}
};

export {
	createSession,
	updateSession,
	getSessionById,
	deleteSession,
	pingSession,
};
