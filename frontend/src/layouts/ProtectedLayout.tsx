// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
// import des composants
import HeaderComponent from "../components/header/Header";
import AppMenuComponent from "../components/menu/AppMenuComponent";
// import du contexte
import { AuthContext } from "../context/AuthContext";

/**
 * Layout de la partie backoffice, qui vérifie si l'utilisateur est connecté
 * et redirige vers la page d'authentification si ce n'est pas le cas
 * @returns HeaderComponent
 */
const ProtectedLayout = () => {
	const { token } = useContext(AuthContext);
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore "navigate" dans le tableau de dépendances
	// useEffect(() => {
	// 	const checkAuthentication = async () => {
	// 		if (!token) {
	// 			navigate("/authentification");
	// 		}
	// 	};
	// 	checkAuthentication();
	// }, [token]);

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
