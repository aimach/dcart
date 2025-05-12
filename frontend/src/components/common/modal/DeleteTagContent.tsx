// import des composants
import ButtonComponent from "../button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import { deleteTag } from "../../../utils/api/builtMap/deleteRequests";
import { notifyDeleteSuccess } from "../../../utils/functions/toast";
// import du style
import style from "./modalComponent.module.scss";

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
				<ButtonComponent
					type="button"
					onClickFunction={() => handleTagDelete(idToDelete)}
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

export default DeleteTagContent;
