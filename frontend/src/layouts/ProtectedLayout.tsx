// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
// import des composants
import HeaderComponent from "../components/header/Header";
import AppMenuComponent from "../components/menu/AppMenuComponent";
// import du contexte
import { AuthContext } from "../context/AuthContext";
import { verifyAuthentification } from "../utils/api/authAPI";

/**
 * Layout de la partie backoffice, qui vérifie si l'utilisateur est connecté
 * et redirige vers la page d'authentification si ce n'est pas le cas
 * @returns HeaderComponent
 */
const ProtectedLayout = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const navigate = useNavigate();
	console.log(isAuthenticated);

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore "navigate" dans le tableau de dépendances
	useEffect(() => {
		const checkAuthentication = async () => {
			const isLogged = await verifyAuthentification();
			console.log(isLogged);
			if (!isLogged) {
				navigate("/");
			}
		};
		checkAuthentication();
	}, [isAuthenticated]);

	// définition de l'état pour l'affichage du menu
	const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

	return menuIsOpen ? (
		<AppMenuComponent setMenuIsOpen={setMenuIsOpen} />
	) : (
		<div>
			<HeaderComponent type={"backoffice"} setMenuIsOpen={setMenuIsOpen} />
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default ProtectedLayout;
