// import des services
import { apiClient } from "../apiClient";
import {
	notifyEditSuccess,
	notifyError,
	notifyPublicationSuccess,
} from "../../functions/toast";
// import des types
import type {
	DivinityListType,
	MapInfoType,
	PointSetType,
	TagType,
} from "../../types/mapTypes";

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

/**
 * Envoie une requête PUT pour modifier un jeu de points
 * @param body - Les informations du jeu de points à modifier
 * @returns {Promise} - La réponse de la requête
 */
const updatePointSet = async (body: PointSetType) => {
	try {
		const newPointSet = await apiClient(`dcart/attestations/${body.id}`, {
			method: "PUT",
			data: JSON.stringify(body),
		});
		return newPointSet;
	} catch (error) {
		console.error(
			"Erreur lors de la modification du jeu d'attestations :",
			error,
		);
	}
};

/**
 * Envoie une requête PUT pour modifier un jeu de points
 * @param body - Les informations du jeu de points à modifier
 * @returns {Promise} - La réponse de la requête
 */
const cleanPointSet = async (
	pointSetId: string,
	pointSetType: "bdd" | "custom",
) => {
	try {
		await apiClient(`dcart/attestations/clean/${pointSetId}`, {
			method: "PUT",
		});
	} catch (error) {
		console.error(
			"Erreur lors de la suppression des points du jeu d'attestations :",
			error,
		);
	}
};

/**
 * Envoie une requête PUT pour modifier une étiquette
 * @param body - Les informations de l'étiquette à modifier
 * @returns {Promise} - La réponse de la requête
 */
const updateTag = async (body: TagType) => {
	try {
		const response = await apiClient(`dcart/tags/${body.id}`, {
			method: "PUT",
			data: body,
		});
		return response.status;
	} catch (error) {
		console.error("Erreur lors de la modification de l'étiquette :", error);
	}
};

/**
 * Envoie une requête PUT pour modifier la liste des divinités
 * @param body - La nouvelle liste des divinités
 * @returns {Promise} - La réponse de la requête
 */
const updateDivinityList = async (body: DivinityListType) => {
	try {
		const response = await apiClient("dcart/divinities", {
			method: "PUT",
			data: body,
		});
		return response.status;
	} catch (error) {
		console.error(
			"Erreur lors de la modification de la liste des divinités:",
			error,
		);
	}
};

export {
	updateMap,
	updateFiltersToMap,
	updateMapActiveStatus,
	updateMapFilterOptions,
	updatePointSet,
	updateTag,
	updateDivinityList,
	cleanPointSet,
};
