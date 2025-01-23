// import des services
import { apiClient } from "../api/apiClient";

// récupérer toutes les informations de toutes les cartes (titre, description, critères...)
const getAllMapsInfos = async () => {
	const response = await apiClient.get("/map/all");
	const allMapsInfos = await response.data;
	return allMapsInfos;
};

// récupérer toutes les informations d'une carte (titre, description, critères...)
const getOneMapInfos = async (mapId: string) => {
	if (mapId !== "exploration") {
		const response = await apiClient.get(`/map/${mapId}`);
		const mapInfos = await response.data;
		return mapInfos;
	}
	return null;
};

// récupérer toutes les sources d'une carte
const getAllPointsByMapId = async (id: string, params: FormData | null) => {
	const queryArray = [];
	let query = "";
	if (params !== null) {
		for (const param of params) {
			queryArray.push(`${param[0]}=${param[1]}`);
		}
		query = queryArray.length ? `?${queryArray.join("&")}` : "";
	}
	const response = await apiClient.get(`/map/${id}/sources${query}`);
	const allPoints = await response.data;
	return allPoints;
};

// récupérer toutes les grandes régions
const getAllGreatRegions = async () => {
	const response = await apiClient.get("/map/db/regions");
	const allGreatRegions = await response.data;
	return allGreatRegions;
};

// récupérer toutes les divinités
const getAllDivinities = async () => {
	const response = await apiClient.get("/map/db/divinities");
	const allDivinities = await response.data;
	return allDivinities;
};

// récupérer les bornes temporelles de tous les points
const getTimeMarkers = async () => {
	const response = await apiClient.get("/map/db/timeMarkers");
	const timeMarker = await response.data;
	return timeMarker;
};

export {
	getAllMapsInfos,
	getOneMapInfos,
	getAllPointsByMapId,
	getAllGreatRegions,
	getAllDivinities,
	getTimeMarkers,
};
