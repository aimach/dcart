// import des services
import { apiClient } from "../api/apiClient";

const getAllMapsInfos = async () => {
	const response = await apiClient.get("/map/all");
	const allMapsInfos = await response.data;
	return allMapsInfos;
};

const getOneMapInfos = async (mapId: string) => {
	if (mapId !== "all") {
		const response = await apiClient.get(`/map/${mapId}`);
		const mapInfos = await response.data;
		return mapInfos;
	}
	return null;
};

const getAllPointsByMapId = async (id: string) => {
	const response = await apiClient.get(`/map/${id}/sources`);
	const allPoints = await response.data;
	return allPoints;
};

export { getAllMapsInfos, getOneMapInfos, getAllPointsByMapId };
