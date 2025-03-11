// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import { useBuilderStore } from "../../../utils/stores/storymap/builderStore";
import { deleteBlock } from "../../../utils/api/storymap/getRequests";
// import des types
// import du style
import style from "./modalComponent.module.scss";

/**
 * Affiche le contenu du modal de suppression d'un block : texte de validation et boutons de confirmation (oui/non)
 */
const DeleteBlockModalContent = () => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	// récupération des données des stores
	const { closeDeleteModal } = useModalStore();
	const { block, updateBlockContent, reload, setReload } = useBuilderStore();

	// fonction pour supprimer un block (suppression de la BDD, fermeture du modal et rechargement des composants)
	const handleBlockDelete = (blockId: string) => {
		try {
			deleteBlock(blockId);
			updateBlockContent(null);
			closeDeleteModal();
			setReload(!reload);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		block && (
			<div className={style.modalCustomContentContainer}>
				{translation[language].modal.deleteBlockText}
				<div className={style.buttonContainer}>
					<button type="button" onClick={() => handleBlockDelete(block.id)}>
						{translation[language].modal.yes}
					</button>
					<button type="button" onClick={() => closeDeleteModal()}>
						{translation[language].modal.no}
					</button>
				</div>
			</div>
		)
	);
};

export default DeleteBlockModalContent;
