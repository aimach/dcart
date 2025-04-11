// import des serivces
import { apiClient } from "../apiClient";
// import des types
import type { MapInfoType } from "../../types/mapTypes";
import {
	notifyEditSuccess,
	notifyError,
	notifyPublicationSuccess,
} from "../../functions/toast";

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
		notifyEditSuccess("Carte", false);
		return response;
	} catch (error) {
		notifyError("Erreur lors de la mise à jour de la carte");
	}
};

/**
 * Envoie une requête PUT pour mettre à jour une carte
 * @param body - Les informations de la carte à mettre à jour
 * @returns {Promise} - La réponse de la requête
 */
const updateMapActiveStatus = async (mapId: string, status: boolean) => {
	try {
		const response = await apiClient(`dcart/maps/${mapId}?isActive=${status}`, {
			method: "PUT",
		});
		notifyPublicationSuccess("Carte", status);
		return response;
	} catch (error) {
		notifyError("Erreur lors de la mise à jour du statut de la carte");
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
		notifyEditSuccess("Jeu de filtres", false);
		return response;
	} catch (error) {
		notifyError("Erreur lors de la modification des filtres de la carte");
	}
};

/**
 * Envoie une requête PUT pour modifier les options d'un filtre d'une carte
 * @param mapId - L'id de la carte
 * @param filterType - Le type de filtre à modifier
 * @param mapFiltersOptions - Les nouvelles options du filtre à modifier
 * @returns la réponse de la requête
 */
const updateMapFilterOptions = async (
	mapId: string,
	filterType: string,
	mapFiltersOptions: string,
) => {
	try {
		const response = await apiClient(
			`dcart/filters/update/${mapId}/${filterType}`,
			{
				method: "PUT",
				data: mapFiltersOptions, 
			},
		);
		notifyEditSuccess("Option du filtre", true);
		return response;
	} catch (error) {
		notifyError(
			"Erreur lors de la modification des options du filtre de la carte",
		);
	}
};

export {
	updateMap,
	updateFiltersToMap,
	updateMapActiveStatus,
	updateMapFilterOptions,
};
