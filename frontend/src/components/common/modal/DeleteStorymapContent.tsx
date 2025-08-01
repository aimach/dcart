// import des composants
import ButtonComponent from "../button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import { deleteStorymap } from "../../../utils/api/storymap/deleteRequests";
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
		}
	};

	return (
		<div className={style.modalCustomContentContainer}>
			{translation[language].modal.deteleStorymapText}
			<div className={style.buttonContainer}>
				<ButtonComponent
					type="button"
					onClickFunction={() => handleStorymapDelete(idToDelete)}
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

export default DeleteStorymapContent;
