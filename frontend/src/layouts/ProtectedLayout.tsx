// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
// import des composants
import HeaderComponent from "../components/header/Header";
import AppMenuComponent from "../components/menu/AppMenuComponent";
import StayConnectedContent from "../components/common/modal/StayConnectedContent";
import ModalComponent from "../components/common/modal/ModalComponent";
// import du contexte
import { AuthContext } from "../context/AuthContext";
import { SessionContext } from "../context/SessionContext";
// import des services
import { useModalStore } from "../utils/stores/storymap/modalStore";

/**
 * Layout de la partie backoffice, qui vérifie si l'utilisateur est connecté
 * et redirige vers la page d'authentification si ce n'est pas le cas
 * @returns HeaderComponent
 */
const ProtectedLayout = () => {
	const { token } = useContext(AuthContext);
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore "navigate" dans le tableau de dépendances
	useEffect(() => {
		const checkAuthentication = async () => {
			if (!token) {
				navigate("/authentification");
			}
		};
		checkAuthentication();
	}, [token]);

	// définition de l'état pour l'affichage du menu
	const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

	const { isTimeoutReached } = useContext(SessionContext);
	const { closeDeleteModal } = useModalStore();

	return menuIsOpen ? (
		<AppMenuComponent setMenuIsOpen={setMenuIsOpen} />
	) : (
		<div>
			{isTimeoutReached && (
				<ModalComponent onClose={() => closeDeleteModal()}>
					<StayConnectedContent />
				</ModalComponent>
			)}
			<HeaderComponent type={"backoffice"} setMenuIsOpen={setMenuIsOpen} />
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default ProtectedLayout;
