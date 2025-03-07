// import des services
import { apiClient } from "../apiClient";
// import des types
import type { UserFilterType } from "../../types/filterTypes";

/**
 * Récupère toutes les attestations d'une source à partir de son id
 * @param {string} sourceId - L'id de la source
 * @returns {Promise} - Toutes les attestations de la source
 */
const getAllAttestationsFromSourceId = async (sourceId: string) => {
	try {
		const response = await apiClient.get(
			`/map/sources/${sourceId}/attestations`,
		);
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des attestations de la source :",
			error,
		);
	}
};

/**
 * Récupère toutes les catégories des cartes
 * @returns {Promise} - Toutes les catégories
 */
const getAllCategories = async () => {
	try {
		const response = await apiClient.get("/dcart/categories/all");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des catégories :", error);
	}
};

/**
 * Récupère les catégories qui ont des cartes associées, avec les informations des cartes
 * @returns {Promise} - Toutes les catégories qui ont des cartes associées
 */
const getAllCategoriesWithMapsInfos = async () => {
	try {
		const response = await apiClient.get("/dcart/categories/all/maps");
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des catégories avec les informations des cartes :",
			error,
		);
	}
};

/**
 * Récupère toutes les divinités
 * @returns {Promise} - Toutes les divinités de la BDD MAP
 */
const getAllDivinities = async () => {
	try {
		const response = await apiClient.get("/map/elements/divinities/all");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des divinités :", error);
	}
};

/**
 * Récupère toutes les grandes régions
 * @returns {Promise} - Toutes les grandes régions
 */
const getAllGreatRegions = async () => {
	try {
		const response = await apiClient.get("/map/locations/regions/all");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des grandes régions :", error);
	}
};

/**
 * Récupère les informations de toutes les cartes qui sont actives
 * @returns {Promise} - Toutes les informations des cartes actives
 */
const getAllMapsInfos = async () => {
	try {
		const response = await apiClient.get("/dcart/maps/all");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des cartes :", error);
	}
};

/**
 * Récupère toutes les cartes d'une catégorie
 * @param {string} categoryId - L'id de la catégorie
 * @returns {Promise} - Toutes les cartes de la catégorie
 */
const getAllMapsInfosFromCategoryId = async (categoryId: string) => {
	try {
		const response = await apiClient.get(
			`/dcart/categories/${categoryId}/maps`,
		);
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des cartes de la catégorie :",
			error,
		);
	}
};

/**
 * Récupère toutes les sources d'une carte à partir de son id
 * @param {string} id - L'id de la carte
 * @param {FormData | UserFilterType | null} params
 * @returns
 */
const getAllPointsByMapId = async (
	id: string,
	params: UserFilterType | null,
) => {
	try {
		const queryArray = [];
		let query = "";
		if (params !== null) {
			for (const [key, value] of Object.entries(params)) {
				if (value !== undefined) {
					queryArray.push(`${key}=${value}`);
				}
			}

			query = queryArray.length ? `?${queryArray.join("&")}` : "";
		}
		const response = await apiClient.get(`/map/sources/${id}${query}`);
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des sources :", error);
	}
};

/**
 * Récupère toutes les sources d'une carte à partir d'une liste d'ids d'attestations (pour la carte démo)
 * @param attestationIds - Les ids des attestations
 * @returns {Promise} - Toutes les sources de la carte
 */
const getAllPointsForDemoMap = async (attestationIds: string) => {
	try {
		const response = await apiClient("map/sources/demo/attestations", {
			method: "POST",
			data: JSON.stringify({ attestationIds }),
		});
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des sources pour la démo :",
			error,
		);
	}
};

/**
 * Récupère toutes les informations d'une carte à partir de son id
 * @param {string} mapId - L'id de la carte
 * @returns {Promise | string} - Les informations de la carte ou une string "exploration"
 */
const getOneMapInfos = async (mapId: string) => {
	try {
		if (mapId !== "exploration") {
			const response = await apiClient.get(`/dcart/maps/${mapId}`);
			const mapInfos = await response.data;
			return mapInfos;
		}
		return "exploration";
	} catch (error) {
		console.error(
			"Erreur lors du chargement des informations de la carte :",
			error,
		);
	}
};

/**
 * Retourne les bornes temporelles de la base de données (tout point confondu)
 * @returns {Promise} - Les bornes temporelles de la base de données
 */
const getTimeMarkers = async () => {
	try {
		const response = await apiClient.get("/map/datation/timeMarkers");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des bornes temporelles :", error);
	}
};

/**
 * Récupère la liste des filtres utilisateur qu'il est possible d'associer à une carte
 * @returns {Promise} - Les filtres utilisateur
 */
const getUserFilters = async () => {
	try {
		const response = await apiClient.get("/dcart/filters/all");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des filtres utilisateur :", error);
	}
};

export {
	getAllAttestationsFromSourceId,
	getAllCategories,
	getAllCategoriesWithMapsInfos,
	getAllDivinities,
	getAllGreatRegions,
	getAllMapsInfos,
	getAllMapsInfosFromCategoryId,
	getAllPointsByMapId,
	getAllPointsForDemoMap,
	getOneMapInfos,
	getTimeMarkers,
	getUserFilters,
};
