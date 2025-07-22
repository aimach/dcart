// import des services
import { notifyDeleteSuccess, notifyError } from "../../functions/toast";
import { apiClient } from "../apiClient";

/**
 * Fonction de suppression d'un bloc
 * @param blockId  - l'id du bloc à supprimer
 */
const deleteBlock = async (blockId: string) => {
	try {
		await apiClient.delete(`/storymap/blocks/${blockId}`);
		notifyDeleteSuccess("Bloc", false);
	} catch (error) {
		notifyError("Erreur lors de la suppression du bloc");
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
		notifyDeleteSuccess("Carte", true);
		return response.status;
	} catch (error) {
		notifyError("Erreur lors de la suppression de la carte");
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
		notifyDeleteSuccess("Storymap", true);
		return response.status;
	} catch (error) {
		notifyError("Erreur lors de la suppression de la storymap");
	}
};

export { deleteBlock, deleteMap, deleteStorymap };
