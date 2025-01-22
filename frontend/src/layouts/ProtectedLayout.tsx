// import des bibliothèques
import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
// import des composants
import HeaderComponent from "../components/header/Header";
// import du contexte
import { AuthContext } from "../context/AuthContext";

const ProtectedLayout = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const navigate = useNavigate();

	// commenté le temps du développement du backoffice
	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore "navigate" dans le tableau de dépendances
	// useEffect(() => {
	// 	if (!isAuthenticated) {
	// 		navigate("/");
	// 	}
	// }, [isAuthenticated]);
	return (
		<div>
			<HeaderComponent type={"backoffice"} />
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default ProtectedLayout;
