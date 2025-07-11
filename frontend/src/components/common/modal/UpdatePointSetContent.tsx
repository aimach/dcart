// import des composants
import ButtonComponent from "../button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { cleanPointSet } from "../../../utils/api/builtMap/putRequests";
// import du style
import style from "./modalComponent.module.scss";

interface UpdatePointSetContentProps {
	idToUpdate: string;
	setIsModalOpen: (isOpen: boolean) => void;
}

/**
 * Affiche le contenu du modal de nettoyage des points d'un jeu de points : texte de validation et boutons de confirmation (oui/non)
 */
const UpdatePointSetContent = ({
	idToUpdate,
	setIsModalOpen,
}: UpdatePointSetContentProps) => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	console.log(idToUpdate);

	const handlePointSetCleaning = async (idToUpdate: string) => {
		await cleanPointSet(idToUpdate);
	};

	return (
		<div className={style.modalCustomContentContainer}>
			{translation[language].modal.cleanPointSetText}
			<div className={style.buttonContainer}>
				<ButtonComponent
					type="button"
					onClickFunction={() => handlePointSetCleaning(idToUpdate)}
					color="green"
					textContent={translation[language].modal.yes}
				/>
				<ButtonComponent
					type="button"
					onClickFunction={() => setIsModalOpen(false)}
					color="red"
					textContent={translation[language].modal.no}
				/>
			</div>
		</div>
	);
};

export default UpdatePointSetContent;
