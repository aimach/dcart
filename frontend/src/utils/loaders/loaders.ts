// import des services
import { apiClient } from "../api/apiClient";
// import des types
import type { UserFilterType } from "../types/filterTypes";

// récupérer toutes les informations de toutes les cartes (titre, description, critères...)
const getAllMapsInfos = async () => {
	const response = await apiClient.get("/dcart/maps/all");
	const allMapsInfos = await response.data;
	return allMapsInfos;
};

// récupérer toutes les informations d'une carte (titre, description, critères...)
const getOneMapInfos = async (mapId: string) => {
	if (mapId !== "exploration") {
		const response = await apiClient.get(`/dcart/maps/${mapId}`);
		const mapInfos = await response.data;
		return mapInfos;
	}
	return null;
};

// récupérer toutes les sources d'une carte
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

// récupérer toutes les grandes régions
const getAllGreatRegions = async () => {
	const response = await apiClient.get("/map/locations/regions/all");
	const allGreatRegions = await response.data;
	return allGreatRegions;
};

// récupérer toutes les divinités
const getAllDivinities = async () => {
	const response = await apiClient.get("/map/elements/divinities/all");
	const allDivinities = await response.data;
	return allDivinities;
};

// récupérer les bornes temporelles de tous les points
const getTimeMarkers = async () => {
	const response = await apiClient.get("/map/datation/timeMarkers");
	const timeMarker = await response.data;
	return timeMarker;
};

// récupérer toutes les catégories avec les cartes associées
const getAllCategoriesWithMapsInfos = async () => {
	const response = await apiClient.get("/dcart/categories/all");
	const allCategories = await response.data;
	return allCategories;
};

// récupérer toutes les cartes d'une catégorie
const getAllMapsInfosFromCategoryId = async (categoryId: string) => {
	const response = await apiClient.get(`/dcart/categories/${categoryId}`);
	const allMaps = await response.data;
	return allMaps;
};

const getAllAttestationsFromSourceId = async (sourceId: string) => {
	const response = await apiClient.get(`/map/sources/${sourceId}/attestations`);
	const allAttestations = await response.data;
	return allAttestations;
};

// utilisée pour récupérer les options de filtre de localisation
const getLocationOptions = async (routeSegment: string) => {
	const response = await apiClient.get(`/map/locations/${routeSegment}`);
	const locationOptions = await response.data;
	return locationOptions;
};

export {
	getAllMapsInfos,
	getOneMapInfos,
	getAllPointsByMapId,
	getAllGreatRegions,
	getAllDivinities,
	getTimeMarkers,
	getAllCategoriesWithMapsInfos,
	getAllMapsInfosFromCategoryId,
	getAllAttestationsFromSourceId,
	getLocationOptions,
};
