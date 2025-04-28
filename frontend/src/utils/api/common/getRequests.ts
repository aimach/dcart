// import des services
import { apiClient } from "../apiClient";

/**
 * Récupère tous les profils des utilisateurs
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
