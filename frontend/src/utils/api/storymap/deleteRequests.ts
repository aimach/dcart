// import des services
import { apiClient } from "../apiClient";

/**
 * Fonction de suppression d'un bloc
 * @param blockId  - l'id du bloc à supprimer
 */
const deleteBlock = async (blockId: string) => {
	try {
		await apiClient.delete(`/storymap/blocks/${blockId}`);
	} catch (error) {
		console.error("Erreur lors de la suppression du bloc :", error);
	}
};

/**
 * Fonction de suppression d'une carte
 * @param mapId  - l'id de la carte à supprimer
 * @returns le statut de la requête
 */
const deleteMap = async (mapId: string) => {
	try {
		const response = await apiClient.delete(`/dcart/maps/${mapId}`);
		return response.status;
	} catch (error) {
		console.error("Erreur lors de la suppression de la carte :", error);
	}
};

/**
 * Fonction de suppression d'une storymap
 * @param storymapId  - l'id de la storymap à supprimer
 * @returns le statut de la requête
 */
const deleteStorymap = async (storymapId: string) => {
	try {
		const response = await apiClient.delete(`/storymap/storymap/${storymapId}`);
		return response.status;
	} catch (error) {
		console.error("Erreur lors de la suppression de la storymap :", error);
	}
};

export { deleteBlock, deleteMap, deleteStorymap };
