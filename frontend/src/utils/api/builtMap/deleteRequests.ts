// import des services
import { apiClient } from "../apiClient";

/**
 * Fonction de suppression d'un jeu de points
 * @param blockId  - l'id du jeu à supprimer
 */
const deletePointSet = async (pointSetId: string) => {
	try {
		await apiClient.delete(`/dcart/attestations/${pointSetId}`);
	} catch (error) {
		console.error("Erreur lors de la suppression du jeu de points :", error);
	}
};

export { deletePointSet };
