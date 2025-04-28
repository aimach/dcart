// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import { deleteUser } from "../../../utils/api/common/deleteRequests";
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

	// fonction pour supprimer une storymap
	const handleUserDelete = async (userId: string) => {
		const responseStatus = await deleteUser(userId);
		// attendre le retour de la requête pour fermer le modal et rafraîchir la liste
		if (responseStatus === 200) {
			closeDeleteModal();
			setReload(!reload);
		}
	};

	return (
		<div className={style.modalCustomContentContainer}>
			{translation[language].modal.deleteUserText}
			<div className={style.buttonContainer}>
				<button type="button" onClick={() => handleUserDelete(idToDelete)}>
					{translation[language].modal.yes}
				</button>
				<button type="button" onClick={() => closeDeleteModal()}>
					{translation[language].modal.no}
				</button>
			</div>
		</div>
	);
};

export default DeleteUserContent;
