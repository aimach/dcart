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
 * @returns {Promise} - Une liste des ids des divinités
 */
const getDivinityIdsList = async () => {
	try {
		const response = await apiClient.get("/dcart/divinities/all");
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement de la liste des divinités :",
			error,
		);
	}
};

/**
 * Récupère la liste des étiquettes
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
 * Récupère toutes les divinités
 * @returns {Promise} - Toutes les divinités de la BDD MAP
 */
const getAllSourceTypes = async () => {
	try {
		const response = await apiClient.get("/map/sourceTypes/all");
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
		let url = "/dcart/maps/id/all";
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
	const body = params ?? {};
	try {
		const response = await apiClient.post(
			`/map/sources/map/${id}`,
			JSON.stringify(body),
		);
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
const getAllStorymapsInfos = async (isActive: boolean) => {
	try {
		let url = "/storymap/storymap/id/all";
		if (isActive) url += "?isActive=true";
		const response = await apiClient.get(url);
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
const getOneMapInfosById = async (mapId: string) => {
	try {
		if (mapId !== "exploration") {
			const response = await apiClient.get(`/dcart/maps/id/${mapId}`);
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
 * Récupère toutes les informations d'une carte à partir de son slug
 * @param {string} mapSlug - Le slug de la carte
 * @returns {Promise | string} - Les informations de la carte ou une string "exploration"
 */
const getOneMapInfosBySlug = async (mapSlug: string) => {
	try {
		if (mapSlug !== "exploration") {
			const response = await apiClient.get(`/dcart/maps/slug/${mapSlug}`);
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

const getAllTagsWithMapsAndStorymaps = async (itemFilter: {
	map: boolean;
	storymap: boolean;
}) => {
	try {
		const filter = `?map=${itemFilter.map}&storymap=${itemFilter.storymap}`;
		const response = await apiClient.get(`/dcart/tags/items${filter}`);
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des cartes et storyamps :", error);
	}
};

const getTagWithMapsAndStorymaps = async (tagSlug: string) => {
	try {
		const response = await apiClient.get(`/dcart/tags/${tagSlug}`);
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des cartes et storyamps :", error);
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
	getOneMapInfosById,
	getOneMapInfosBySlug,
	getTimeMarkers,
	getUserFilters,
	getAllIcons,
	getAllColors,
	getAllPointsByBlockId,
	getAllTagsWithMapsAndStorymaps,
	getTagWithMapsAndStorymaps,
	getAllSourceTypes,
	getDivinityIdsList,
};
