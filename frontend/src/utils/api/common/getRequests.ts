// import des services
import { apiClient } from "../apiClient";

/**
 * Récupère toutes les attestations d'une source à partir de son id
 * @param {string} sourceId - L'id de la source
 * @returns {Promise} - Toutes les attestations de la source
 */
const getAllUsers = async () => {
	try {
		const response = await apiClient.get("/auth/users/all");
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement du profil des utilisateurs :",
			error,
		);
	}
};

export { getAllUsers };
