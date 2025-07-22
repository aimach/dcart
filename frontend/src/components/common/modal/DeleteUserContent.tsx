// import des bibliothèques
import { useContext } from "react";
// import des composants
import ButtonComponent from "../button/ButtonComponent";
// import des context
import { AuthContext } from "../../../context/AuthContext";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import { deleteUser } from "../../../utils/api/profileAPI";
// import du style
import style from "./modalComponent.module.scss";

/**
 * Affiche le contenu du modal de suppression d'un utilisateur : texte de validation et boutons de confirmation (oui/non)
 */
const DeleteUserContent = () => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	// récupération des données des stores
	const { closeDeleteModal, idToDelete, reload, setReload } = useModalStore();

	const { userId } = useContext(AuthContext);

	// fonction pour supprimer une storymap
	const handleUserDelete = async (idToDelete: string, userId: string) => {
		const responseStatus = await deleteUser(idToDelete);
		// attendre le retour de la requête pour fermer le modal et rafraîchir la liste
		if (responseStatus === 200) {
			if (userId === idToDelete) {
				window.location.reload();
			} else {
				closeDeleteModal();
				setReload(!reload);
			}
		}
	};

	return (
		<div className={style.modalCustomContentContainer}>
			{
				translation[language].modal.deleteUserText[
					userId === idToDelete ? "yourself" : "another"
				]
			}
			<div className={style.buttonContainer}>
				<ButtonComponent
					type="button"
					onClickFunction={() => handleUserDelete(idToDelete, userId as string)}
					color="green"
					textContent={translation[language].modal.yes}
				/>
				<ButtonComponent
					type="button"
					onClickFunction={closeDeleteModal}
					color="red"
					textContent={translation[language].modal.no}
				/>
			</div>
		</div>
	);
};

export default DeleteUserContent;
