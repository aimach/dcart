// import des services
import { apiClient } from "../api/apiClient";
// import des types
import type { UserFilterType } from "../types/filterTypes";
import type { PointType } from "../types/mapTypes";

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
	return "exploration";
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

// récupérer toutes les sources d'une carte en cours de création
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

const getPointsTimeMarkers = (allPoints: PointType[]) => {
	const timeMarkers = { post: 400, ante: -1000 };
	for (const points of allPoints) {
		for (const source of points.sources) {
			if (source.ante_quem > timeMarkers.ante) {
				// on arrondit le chiffre pour avoir un multiple de 10 et mieux gérer l'échelle du filtre du temps
				timeMarkers.ante = Math.ceil(source.ante_quem / 10) * 10;
			}
			if (source.post_quem < timeMarkers.post) {
				// on arrondit le chiffre pour avoir un multiple de 10 et mieux gérer l'échelle du filtre du temps
				timeMarkers.post = Math.floor(source.post_quem / 10) * 10;
			}
		}
	}
	return timeMarkers;
};

// récupérer toutes les catégories
const getAllCategories = async () => {
	const response = await apiClient.get("/dcart/categories/all");
	const allCategories = await response.data;
	return allCategories;
};

// récupérer toutes les catégories avec les cartes associées
const getAllCategoriesWithMapsInfos = async () => {
	const response = await apiClient.get("/dcart/categories/all/maps");
	const allCategories = await response.data;
	return allCategories;
};

// récupérer toutes les cartes d'une catégorie
const getAllMapsInfosFromCategoryId = async (categoryId: string) => {
	const response = await apiClient.get(`/dcart/categories/${categoryId}/maps`);
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

// utilisée pour récupérer les filtres utilisateurs
const getUserFilters = async () => {
	const response = await apiClient.get("/dcart/filters/all");
	const userFilters = await response.data;
	return userFilters;
};

export {
	getAllMapsInfos,
	getOneMapInfos,
	getAllPointsByMapId,
	getAllPointsForDemoMap,
	getAllGreatRegions,
	getAllDivinities,
	getTimeMarkers,
	getPointsTimeMarkers,
	getAllCategories,
	getAllCategoriesWithMapsInfos,
	getAllMapsInfosFromCategoryId,
	getAllAttestationsFromSourceId,
	getLocationOptions,
	getUserFilters,
};
