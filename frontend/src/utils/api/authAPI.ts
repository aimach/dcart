// import des types
import type { User } from "../../types/userTypes";
import { apiClient } from "./apiClient";

export const loginUser = async (body: User) => {
	try {
		const loginUserResponse = await apiClient.post("/auth/login", body, {
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
			"/auth/verification",
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
