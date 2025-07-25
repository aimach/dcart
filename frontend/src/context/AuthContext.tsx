// import des bibliothèques
import { useState, createContext, useEffect, useLayoutEffect } from "react";
// import des services
import { refreshAccessToken } from "../utils/api/authAPI";
import { apiClient } from "../utils/api/apiClient";

type AuthContextType = {
	token: string | null;
	setToken: React.Dispatch<React.SetStateAction<string | null>>;
	isAdmin: boolean;
	setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
	userId: null | string;
	setUserId: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthContext = createContext<AuthContextType>({
	token: null,
	setToken: () => {},
	isAdmin: false,
	setIsAdmin: () => {},
	userId: null,
	setUserId: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [token, setToken] = useState<string | null>(null);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await refreshAccessToken();
				if (response) {
					setToken(response.accessToken);
				}
			} catch {
				setToken(null);
			}
		};
		fetchProfile();
	}, []);

	useLayoutEffect(() => {
		const authInterceptor = apiClient.interceptors.request.use((config) => {
			config.headers.Authorization =
				// @ts-ignore
				!config._retry && token
					? `Bearer ${token}`
					: config.headers.Authorization;
			return config;
		});

		return () => {
			apiClient.interceptors.request.eject(authInterceptor);
		};
	}, [token]);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useLayoutEffect(() => {
		const refreshInterceptor = apiClient.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;

				if (error.response.status === 401) {
					try {
						const accessToken = await refreshAccessToken();
						setToken(accessToken);
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
						originalRequest._retry = true;
						return apiClient(originalRequest);
					} catch {
						setToken(null);
					}
				}

				return Promise.reject(error);
			},
		);

		return () => {
			apiClient.interceptors.response.eject(refreshInterceptor);
		};
	}, [token]);

	return (
		<AuthContext.Provider
			value={{ token, setToken, isAdmin, setIsAdmin, userId, setUserId }}
		>
			{children}
		</AuthContext.Provider>
	);
};
