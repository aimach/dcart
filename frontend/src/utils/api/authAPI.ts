// import des services
import { apiClient } from "./apiClient";
// import des types
import type { User } from "../types/userTypes";

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

export const refreshToken = async () => {
	const response = await apiClient.post(
		"/auth/refresh-token",
		{},
		{ withCredentials: true },
	);
	return response.data.accessToken;
};
