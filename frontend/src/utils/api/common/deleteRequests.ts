// import des services
import { notifyDeleteSuccess, notifyError } from "../../functions/toast";
import { apiClient } from "../apiClient";

/**
 * Fonction de suppression d'un utilisateurs
 * @param userId  - l'id de l'utilisateur à supprimer
 * @returns {Promise} - Le statut de la requête
 */
const deleteUser = async (userId: string) => {
	try {
		const response = await apiClient.delete(`/auth/users/${userId}`);
		if (response.status === 200) {
			notifyDeleteSuccess("Utilisateur", false);
			return response.status;
		}
	} catch (error) {
		notifyError("Erreur lors de la suppression d'un utilisateur");
	}
};

export { deleteUser };
