// import des types
import { apiClient } from "../api/apiClient";
import type { MapInfoType } from "../types/mapTypes";

const createNewMap = async (body: MapInfoType) => {
	try {
		const newMap = await apiClient("dcart/maps", {
			method: "POST",
			data: JSON.stringify(body),
		});
		return newMap.data;
	} catch (error) {
		console.error("Erreur lors de la création de la carte :", error);
	}
};

const addFiltersToMap = async (
	mapId: string,
	mapFilters: { [key: string]: boolean },
) => {
	try {
		const response = await apiClient(`dcart/filters/add/${mapId}`, {
			method: "POST",
			data: JSON.stringify({ filters: mapFilters }),
		});
		return response;
	} catch (error) {
		console.error("Erreur lors de la création de la carte :", error);
	}
};

export { createNewMap, addFiltersToMap };
