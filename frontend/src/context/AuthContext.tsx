// import des bibliothèques
import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
// import des services
import { getProfile, refreshToken } from "../utils/api/authAPI";

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
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		// fonction de vérification de l'authentification
		const checkAuthentication = async () => {
			try {
				// génération d'un nouveau token d'accès
				const newAccessToken = await refreshToken();
				axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

				// Récupérer les infos de l'utilisateur
				const response = await getProfile(newAccessToken);
				if (response.status === 200) {
					setIsAuthenticated(true); // L'utilisateur est connecté
				}
			} catch (error) {
				setIsAuthenticated(false); // L'utilisateur n'est pas connecté
			}
		};
		checkAuthentication();
	}, [navigate]); // on laisse navigate le temps de production
	return (
		<AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};
