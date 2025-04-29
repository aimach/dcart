// import des services
import { apiClient } from "./apiClient";
import {
	notifyEditSuccess,
	notifyDeleteSuccess,
	notifyError,
} from "../functions/toast";

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

export { getAllUsers, updateUserStatus, deleteUser };
