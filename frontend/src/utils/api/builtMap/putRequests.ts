// import des serivces
import { apiClient } from "../apiClient";
// import des types
import type { MapInfoType } from "../../types/mapTypes";

/**
 * Envoie une requête PUT pour mettre à jour une carte
 * @param body - Les informations de la carte à mettre à jour
 * @returns {Promise} - La réponse de la requête
 */
const updateMap = async (body: MapInfoType) => {
	try {
		const response = await apiClient(`dcart/maps/${body.id}`, {
			method: "PUT",
			data: JSON.stringify(body),
		});
		return response;
	} catch (error) {
		console.error("Erreur lors de la mise à jour de la carte :", error);
	}
};

/**
 * Envoie une requête PUT avec la liste des filtres à ajouter/modifier à une carte
 * @param mapId - L'id de la carte
 * @param mapFilters - La liste des filtres à ajouter/modifier à la carte
 * @returns {Promise} - La réponse de l'ajout des filtres à la carte
 */
const updateFiltersToMap = async (
	mapId: string,
	mapFilters: Record<string, boolean>,
) => {
	try {
		const response = await apiClient(`dcart/filters/update/${mapId}`, {
			method: "PUT",
			data: JSON.stringify(mapFilters),
		});
		return response;
	} catch (error) {
		console.error(
			"Erreur lors de la modification des filtres de la carte :",
			error,
		);
	}
};

export { updateMap, updateFiltersToMap };
