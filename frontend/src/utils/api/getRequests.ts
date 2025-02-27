// import des services
import { apiClient } from "../api/apiClient";
// import des types
import type {
	GreatRegionType,
	MapInfoType,
	MapType,
	PointType,
} from "../types/mapTypes";
import type { UserFilterType } from "../types/filterTypes";

/**
 * Récupère toutes les attestations d'une source à partir de son id
 * @param {string} sourceId - L'id de la source
 * @returns {Promise} - Toutes les attestations de la source
 */
const getAllAttestationsFromSourceId = async (sourceId: string) => {
	const response = await apiClient.get(`/map/sources/${sourceId}/attestations`);
	const allAttestations = await response.data;
	return allAttestations;
};

/**
 * Récupère toutes les catégories des cartes
 * @returns {Promise} - Toutes les catégories
 */
const getAllCategories = async () => {
	const response = await apiClient.get("/dcart/categories/all");
	const allCategories = await response.data;
	return allCategories;
};

/**
 * Récupère les catégories qui ont des cartes associées, avec les informations des cartes
 * @returns {Promise} - Toutes les catégories qui ont des cartes associées
 */
const getAllCategoriesWithMapsInfos = async () => {
	const response = await apiClient.get("/dcart/categories/all/maps");
	const allCategories = await response.data;
	return allCategories;
};

/**
 * Récupère toutes les divinités
 * @returns {Promise} - Toutes les divinités
 */
const getAllDivinities = async () => {
	const response = await apiClient.get("/map/elements/divinities/all");
	const allDivinities = await response.data;
	return allDivinities;
};

/**
 * Récupère toutes les grandes régions
 * @returns {Promise} - Toutes les grandes régions
 */
const getAllGreatRegions = async () => {
	const response = await apiClient.get("/map/locations/regions/all");
	const allGreatRegions = await response.data;
	return allGreatRegions;
};

/**
 * Récupère les informations de toutes les cartes qui sont actives
 * @returns {Promise} - Toutes les informations des cartes actives
 */
const getAllMapsInfos = async () => {
	const response = await apiClient.get("/dcart/maps/all");
	const allMapsInfos = await response.data;
	return allMapsInfos;
};

/**
 * Récupère toutes les cartes d'une catégorie
 * @param {string} categoryId - L'id de la catégorie
 * @returns {Promise} - Toutes les cartes de la catégorie
 */
const getAllMapsInfosFromCategoryId = async (categoryId: string) => {
	const response = await apiClient.get(`/dcart/categories/${categoryId}/maps`);
	const allMaps = await response.data;
	return allMaps;
};

/**
 * Récupère toutes les sources d'une carte à partir de son id
 * @param {string} id - L'id de la carte
 * @param {FormData | UserFilterType | null} params
 * @returns
 */
const getAllPointsByMapId = async (
	id: string,
	params: FormData | UserFilterType | null,
) => {
	const queryArray = [];
	let query = "";
	if (params !== null) {
		if (params instanceof FormData) {
			for (const param of params) {
				queryArray.push(`${param[0]}=${param[1]}`);
			}
		} else {
			for (const [key, value] of Object.entries(params)) {
				if (value !== undefined) {
					queryArray.push(`${key}=${value}`);
				}
			}
		}
		query = queryArray.length ? `?${queryArray.join("&")}` : "";
	}
	const response = await apiClient.get(`/map/sources/${id}${query}`);
	const allPoints = await response.data;
	return allPoints;
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
		const allPoints = await response.data;
		return allPoints;
	} catch (error) {
		console.error("Erreur lors du chargement des sources :", error);
	}
};

/**
 * Récupère toutes les informations d'une carte à partir de son id
 * @param {string} mapId - L'id de la carte
 * @returns {Promise} - Les informations de la carte
 */
const getOneMapInfos = async (mapId: string) => {
	if (mapId !== "exploration") {
		const response = await apiClient.get(`/dcart/maps/${mapId}`);
		const mapInfos = await response.data;
		return mapInfos;
	}
	return "exploration";
};

/**
 * Retourne les bornes temporelles de la base de données (tout point confondu)
 * @returns {Promise} - Les bornes temporelles de la base de données
 */
const getTimeMarkers = async () => {
	const response = await apiClient.get("/map/datation/timeMarkers");
	const timeMarker = await response.data;
	return timeMarker;
};

/**
 * Récupère la liste des filtres utilisateur qu'il est possible d'associer à une carte
 * @returns {Promise} - Les filtres utilisateur
 */
const getUserFilters = async () => {
	const response = await apiClient.get("/dcart/filters/all");
	const userFilters = await response.data;
	return userFilters;
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
