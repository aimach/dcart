// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import { deleteStorymap } from "../../../utils/api/storymap/deleteRequests";
import { notifyDeleteSuccess } from "../../../utils/functions/toast";
// import du style
import style from "./modalComponent.module.scss";

/**
 * Affiche le contenu du modal de suppression d'une storymap : texte de validation et boutons de confirmation (oui/non)
 */
const DeleteStorymapContent = () => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	// récupération des données des stores
	const { closeDeleteModal, idToDelete, reload, setReload } = useModalStore();

	// fonction pour supprimer une storymap
	const handleStorymapDelete = async (storymapId: string) => {
		const responseStatus = await deleteStorymap(storymapId);
		// attendre le retour de la requête pour fermer le modal et rafraîchir la liste
		if (responseStatus === 200) {
			closeDeleteModal();
			setReload(!reload);
			notifyDeleteSuccess("Storymap", true);
		}
	};

	return (
		<div className={style.modalCustomContentContainer}>
			{translation[language].modal.deteleStorymapText}
			<div className={style.buttonContainer}>
				<button type="button" onClick={() => handleStorymapDelete(idToDelete)}>
					{translation[language].modal.yes}
				</button>
				<button type="button" onClick={() => closeDeleteModal()}>
					{translation[language].modal.no}
				</button>
			</div>
		</div>
	);
};

export default DeleteStorymapContent;
