// import des services
import { apiClient } from "../apiClient";

/**
 * Fonction de suppression d'un jeu de points
 * @param pointSetId  - l'id du jeu à supprimer
 */
const deletePointSet = async (pointSetId: string) => {
	try {
		await apiClient.delete(`/dcart/attestations/${pointSetId}`);
	} catch (error) {
		console.error("Erreur lors de la suppression du jeu de points :", error);
	}
};

/**
 * Fonction de suppression d'une étiquette
 * @param tagId  - l'id de l'étiquette à supprimer
 */
const deleteTag = async (tagId: string) => {
	try {
		const response = await apiClient.delete(`/dcart/tags/${tagId}`);
		return response.status;
	} catch (error) {
		console.error("Erreur lors de la suppression de l'étiquette :", error);
	}
};

export { deletePointSet, deleteTag };
