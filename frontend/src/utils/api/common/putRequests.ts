// import des serivces
import { notifyEditSuccess, notifyError } from "../../functions/toast";
import { apiClient } from "../apiClient";

/**
 * Envoie une requête PUT pour mettre à jour le statut d'un utilisateur
 * @param userId - L'ID de l'utilisateur à mettre à jour
 * @returns {Promise} - La réponse de la requête
 */
const updateUserStatus = async (userId: string) => {
	try {
		const response = await apiClient(`auth/users/${userId}/status`, {
			method: "PUT",
		});
		if (response.status === 200) {
			notifyEditSuccess("Utilisateur", false);
			return response.status;
		}
	} catch (error) {
		notifyError("Erreur lors de la mise à jour du statut de l'utilisateur");
	}
};

export { updateUserStatus };
