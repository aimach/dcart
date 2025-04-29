// import des custom hooks
import { updateUserStatus } from "../../../utils/api/profileAPI";
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import du style
import style from "./modalComponent.module.scss";

/**
 * Affiche le contenu du modal de modification du statut d'un utilisateur : texte de validation et boutons de confirmation (oui/non)
 */
const UpdateUserStatusContent = () => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	// récupération des données des stores
	const { closeUpdateModal, idToUpdate, reload, setReload } = useModalStore();

	// fonction pour supprimer une storymap
	const handleUserUpdate = async (userId: string) => {
		const responseStatus = await updateUserStatus(userId);
		// attendre le retour de la requête pour fermer le modal et rafraîchir la liste
		if (responseStatus === 200) {
			closeUpdateModal();
			setReload(!reload);
		}
	};

	return (
		<div className={style.modalCustomContentContainer}>
			{translation[language].modal.modifyUserStatusText}
			<div className={style.buttonContainer}>
				<button type="button" onClick={() => handleUserUpdate(idToUpdate)}>
					{translation[language].modal.yes}
				</button>
				<button type="button" onClick={() => closeUpdateModal()}>
					{translation[language].modal.no}
				</button>
			</div>
		</div>
	);
};

export default UpdateUserStatusContent;
