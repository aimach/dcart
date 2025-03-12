// import des serivces
import { apiClient } from "../apiClient";
// import des types
import type { MapInfoType } from "../../types/mapTypes";

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
		return newMap.data;
	} catch (error) {
		console.error("Erreur lors de la création de la carte :", error);
	}
};

export { createNewMap, addFiltersToMap };
