// import des bibliothèques
import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router";
// import des services
import { verifyAuthentification } from "../utils/api/authAPI";

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

	// fonction de vérification de l'authentification
	const checkAuthentication = async () => {
		const isAuthenticatedBoolean = await verifyAuthentification();
		setIsAuthenticated(isAuthenticatedBoolean as boolean);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// on vérifie une première fois
		checkAuthentication();
	}, [navigate]); // on vérifie à chaque changement de page

	return (
		<AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};
