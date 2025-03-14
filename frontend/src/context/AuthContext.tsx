// import des bibliothèques
import { useState, createContext, useEffect } from "react";

// import des services
import { getProfile, refreshAccessToken } from "../utils/api/authAPI";
import { apiClient } from "../utils/api/apiClient";

type AuthContextType = {
	isAuthenticated: boolean;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	setIsAuthenticated: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		// fonction de vérification de l'authentification
		const checkAuthentication = async () => {
			try {
				// génération d'un nouveau token d'accès
				const newAccessToken = await refreshAccessToken();
				// ajout de ce token dans les headers de l'apiClient
				apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

				// Récupérer les infos de l'utilisateur
				const response = await getProfile(newAccessToken);
				if (response.user) {
					setIsAuthenticated(true); // L'utilisateur est connecté
				}
			} catch (error) {
				setIsAuthenticated(false); // L'utilisateur n'est pas connecté
			}
		};
		checkAuthentication();
	}, []); // on laisse navigate le temps de production
	return (
		<AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};
