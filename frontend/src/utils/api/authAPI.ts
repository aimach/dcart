// import des services
import { apiClient } from "./apiClient";
// import des types
import type { User } from "../../types/userTypes";

export const loginUser = async (body: User) => {
	try {
		const loginUserResponse = await apiClient.post("/dcart/auth/login", body, {
			withCredentials: true,
		});
		if (loginUserResponse.status === 200) {
			return true;
		}
		return false;
	} catch (error) {
		console.log("error", error);
	}
};

export const verifyAuthentification = async () => {
	try {
		const verifyAuthenticiationResponse = await apiClient.get(
			"/dcart/auth/verification",
			{
				withCredentials: true,
			},
		);
		if (verifyAuthenticiationResponse.data.userId) return true;
		return false;
	} catch (error) {
		console.log("error", error);
	}
};
