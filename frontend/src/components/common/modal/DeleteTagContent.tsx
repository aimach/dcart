// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import du style
import style from "./modalComponent.module.scss";
import { deleteTag } from "../../../utils/api/builtMap/deleteRequests";
import { notifyDeleteSuccess } from "../../../utils/functions/toast";

/**
 * Affiche le contenu du modal de suppression d'une étiquette : texte de validation et boutons de confirmation (oui/non)
 */
const DeleteTagContent = () => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	// récupération des données des stores
	const { closeDeleteModal, idToDelete, reload, setReload } = useModalStore();

	// fonction pour supprimer une storymap
	const handleTagDelete = async (tagId: string) => {
		const responseStatus = await deleteTag(tagId);
		if (responseStatus === 200) {
			closeDeleteModal();
			setReload(!reload);
			notifyDeleteSuccess("Étiquette", true);
		}
	};

	return (
		<div className={style.modalCustomContentContainer}>
			{translation[language].modal.deleteTagText}
			<div className={style.buttonContainer}>
				<button type="button" onClick={() => handleTagDelete(idToDelete)}>
					{translation[language].modal.yes}
				</button>
				<button type="button" onClick={() => closeDeleteModal()}>
					{translation[language].modal.no}
				</button>
			</div>
		</div>
	);
};

export default DeleteTagContent;
