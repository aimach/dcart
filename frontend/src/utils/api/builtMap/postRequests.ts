// import des serivces
import { apiClient } from "../apiClient";
// import des types
import type { MapInfoType, PointSetType } from "../../types/mapTypes";

/**
 * Envoie une requête POST avec la liste des filtres à ajouter à une carte
 * @param mapId - L'id de la carte
 * @param mapFilters - La liste des filtres à ajouter à la carte
 * @returns {Promise} - La réponse de l'ajout des filtres à la carte
 */
const addFiltersToMap = async (
	mapId: string,
	mapFilters: Record<string, boolean>,
) => {
	try {
		const response = await apiClient(`dcart/filters/add/${mapId}`, {
			method: "POST",
			data: JSON.stringify(mapFilters),
		});
		return response;
	} catch (error) {
		console.error("Erreur lors de l'ajout des filtres à la carte :", error);
	}
};

/**
 * Envoie une requête POST pour créer une nouvelle carte
 * @param body - Les informations de la carte à créer
 * @returns {Promise} - La réponse de la création de la carte
 */
const createNewMap = async (body: MapInfoType) => {
	try {
		const newMap = await apiClient("dcart/maps", {
			method: "POST",
			data: JSON.stringify(body),
		});
		return newMap;
	} catch (error) {
		console.error("Erreur lors de la création de la carte :", error);
	}
};

/**
 * Envoie une requête POST pour créer un jeu de points
 * @param body - Les informations du jeu de points à créer
 * @returns {Promise} - La réponse de la requête
 */
const createPointSet = async (body: PointSetType) => {
	try {
		const newPointSet = await apiClient("dcart/attestations", {
			method: "POST",
			data: JSON.stringify(body),
		});
		return newPointSet;
	} catch (error) {
		console.error("Erreur lors de la création du jeu d'attestations :", error);
	}
};

/**
 * Envoie une requête POST pour ajouter une storymap à une carte
 * @param storymapId - L'id de la storymap
 * @param mapId - L'id de la carte
 * @returns {Promise} - La réponse de l'ajout de la storymap à la carte
 */
const addStorymapLinkToMap = async (storymapId: string, mapId: string) => {
	try {
		const response = await apiClient(`dcart/maps/${mapId}/relatedStorymap`, {
			method: "PUT",
			data: JSON.stringify({
				storymapId,
			}),
		});
		return response;
	} catch (error) {
		console.error("Erreur lors de l'ajout de la storymap à la carte:", error);
	}
};

export { createNewMap, addFiltersToMap, createPointSet, addStorymapLinkToMap };
