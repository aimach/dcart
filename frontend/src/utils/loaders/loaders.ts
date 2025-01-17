// import des services
import { apiClient } from "../api/apiClient";

const getAllMapsInfos = async () => {
	const response = await apiClient.get("/map/all");
	const allMapsInfos = await response.data;
	return allMapsInfos;
};

const getAllPointsByMapId = async (id: string) => {
	const response = await apiClient.get(`/map/${id}/sources`);
	const allPoints = await response.data;
	return allPoints;
};

export { getAllMapsInfos, getAllPointsByMapId };
