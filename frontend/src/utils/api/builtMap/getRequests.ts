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
 * Récupère tous les tags
 * @returns {Promise} - Toutes les catégories
 */
const getAllTags = async () => {
	try {
		const response = await apiClient.get("/dcart/tags/all");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des tags :", error);
	}
};

/**
 * Récupère les catégories qui ont des cartes associées, avec les informations des cartes
 * @returns {Promise} - Toutes les catégories qui ont des cartes associées
 */
const getAllTagsWithMapsInfos = async () => {
	try {
		const response = await apiClient.get("/dcart/tags/all/maps");
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des tags avec les informations des cartes :",
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
const getAllMapsInfos = async (isActive: boolean) => {
	try {
		let url = "/dcart/maps/all";
		if (isActive) url += "?isActive=true";
		const response = await apiClient.get(url);
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des cartes :", error);
	}
};

/**
 * Récupère toutes les cartes d'un tag'
 * @param {string} tagId - L'id du tag
 * @returns {Promise} - Toutes les cartes du tag
 */
const getAllMapsInfosFromtagId = async (tagId: string) => {
	try {
		const response = await apiClient.get(`/dcart/tags/${tagId}/maps`);
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
				if (key === "lotIds" && value !== undefined) {
					if (Array.isArray(value) && Array.isArray(value[0])) {
						const lotIds = value
							.map((lot: string[]) => JSON.stringify(lot))
							.join("|");
						queryArray.push(`lotIds=${lotIds}`);
					}
				} else if (value !== undefined) {
					queryArray.push(`${key}=${value}`);
				}
			}

			query = queryArray.length ? `?${queryArray.join("&")}` : "";
		}
		const response = await apiClient.get(`/map/sources/map/${id}${query}`);
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des sources :", error);
	}
};

/**
 * Récupère toutes les sources d'une carte à partir de l'id du block
 * @param {string} id - L'id du block
 * @returns
 */
const getAllPointsByBlockId = async (blockId: string, side?: string) => {
	try {
		const response = await apiClient.get(
			`/map/sources/block/${blockId}${side ? `?side=${side}` : ""}`,
		);
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
 * Récupère les informations de toutes les cartes qui sont actives
 * @returns {Promise} - Toutes les informations des cartes actives
 */
const getAllStorymapsInfos = async () => {
	try {
		const response = await apiClient.get("/storymap/storymap/all");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des cartes :", error);
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

/**
 * Récupère la liste des icônes de la BDD
 * @returns {Promise} - Les icônes
 */
const getAllIcons = async () => {
	try {
		const response = await apiClient.get("/dcart/icons/all");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des icônes :", error);
	}
};

/**
 * Récupère la liste des couleurs pour les icônes de la BDD
 * @returns {Promise} - Les couleurs
 */
const getAllColors = async () => {
	try {
		const response = await apiClient.get("/dcart/colors/all");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des couleurs :", error);
	}
};

export {
	getAllAttestationsFromSourceId,
	getAllTags,
	getAllTagsWithMapsInfos,
	getAllDivinities,
	getAllGreatRegions,
	getAllMapsInfos,
	getAllMapsInfosFromtagId,
	getAllPointsByMapId,
	getAllPointsForDemoMap,
	getAllStorymapsInfos,
	getOneMapInfos,
	getTimeMarkers,
	getUserFilters,
	getAllIcons,
	getAllColors,
	getAllPointsByBlockId,
};
