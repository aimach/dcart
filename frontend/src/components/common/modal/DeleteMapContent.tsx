// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import {
	deleteMap,
	deleteStorymap,
} from "../../../utils/api/storymap/getRequests";
// import du style
import style from "./modalComponent.module.scss";

/**
 * Affiche le contenu du modal de suppression d'une carte : texte de validation et boutons de confirmation (oui/non)
 */
const DeleteMapContent = () => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	// récupération des données des stores
	const { closeDeleteModal, idToDelete, reload, setReload } = useModalStore();

	// fonction pour supprimer une storymap
	const handleMapDelete = async (mapId: string) => {
		const responseStatus = await deleteMap(mapId);
		// attendre le retour de la requête pour fermer le modal et rafraîchir la liste
		if (responseStatus === 200) {
			closeDeleteModal();
			setReload(!reload);
		}
	};

	return (
		<div className={style.modalCustomContentContainer}>
			{translation[language].modal.deteleMapText}
			<div className={style.buttonContainer}>
				<button type="button" onClick={() => handleMapDelete(idToDelete)}>
					{translation[language].modal.yes}
				</button>
				<button type="button" onClick={() => closeDeleteModal()}>
					{translation[language].modal.no}
				</button>
			</div>
		</div>
	);
};

export default DeleteMapContent;
