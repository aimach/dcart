// import des types
import { apiClient } from "../api/apiClient";
import type { MapInfoType } from "../types/mapTypes";

const createNewMap = async (body: MapInfoType) => {
	try {
		await apiClient("dcart/maps", {
			method: "POST",
			data: JSON.stringify(body),
		});
	} catch (error) {}
};

export { createNewMap };
