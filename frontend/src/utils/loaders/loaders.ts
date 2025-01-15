// import des services
import { apiClient } from "../api/apiClient";

const getAllMapsInfos = async () => {
	const response = await apiClient.get("/map/all");
	const allMapsInfos = await response.data;
	return allMapsInfos;
};

export { getAllMapsInfos };
