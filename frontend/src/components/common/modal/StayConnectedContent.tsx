// import des bibliothèques
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
// import des composants
import ButtonComponent from "../button/ButtonComponent";
// import du contexte
import { SessionContext } from "../../../context/SessionContext";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { deleteSession, updateSession } from "../../../utils/api/sessionAPI";

// import du style
import style from "./modalComponent.module.scss";

/**
 * Affiche le contenu de la modal en cas d'atteinte du timeout de la session (rester connecté ou non)
 */
const StayConnectedContent = () => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	// récupération des données du contexte
	const { setIsTimeoutReached, setSession } = useContext(SessionContext);

	const navigate = useNavigate();

	// affichage du compte à rebours
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const deleteSessionAfterInactivity = async () => {
			setIsTimeoutReached(false);
			setSession(null);
			// suppression de la session en cours
			await deleteSession();
			// redirection vers la page d'accueil
			navigate("/backoffice");
		};
		const timeout = setTimeout(
			() => {
				deleteSessionAfterInactivity();
			},
			1 * 60 * 1000, // 1 minute pour l'utilisateur pour rester connecté
		);

		return () => clearTimeout(timeout);
	}, []);

	const handleStayConnected = async () => {
		const session = await updateSession();
		setSession(session);
		setIsTimeoutReached(false);
	};

	return (
		<div className={style.modalCustomContentContainer}>
			{translation[language].backoffice.stillConnected}
			<br />
			{translation[language].backoffice.disconnectInOneMinute}
			<div className={style.buttonContainer}>
				<ButtonComponent
					type="button"
					color="green"
					textContent={translation[language].modal.yes}
					onClickFunction={handleStayConnected}
				/>
			</div>
		</div>
	);
};

export default StayConnectedContent;
