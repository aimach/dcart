// import des composants
import ButtonComponent from "../button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { cleanPointSet } from "../../../utils/api/builtMap/putRequests";
// import du style
import style from "./modalComponent.module.scss";
import { useMapFormStore } from "../../../utils/stores/builtMap/mapFormStore";
import { useShallow } from "zustand/shallow";
import { getOneMapInfosById } from "../../../utils/api/builtMap/getRequests";

interface UpdatePointSetContentProps {
	idToUpdate: string;
	setIsModalOpen: (isOpen: boolean) => void;
	reload: boolean;
	setReload: (reload: boolean) => void;
}

/**
 * Affiche le contenu du modal de nettoyage des points d'un jeu de points : texte de validation et boutons de confirmation (oui/non)
 */
const UpdatePointSetContent = ({
	idToUpdate,
	setIsModalOpen,
	reload,
	setReload,
}: UpdatePointSetContentProps) => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	const { mapInfos, setMapInfos } = useMapFormStore(
		useShallow((state) => state),
	);

	const handlePointSetCleaning = async (idToUpdate: string) => {
		await cleanPointSet(idToUpdate);
		setIsModalOpen(false);
		const fetchMapInfos = async () => {
			const allMapInfos = await getOneMapInfosById(mapInfos?.id as string);
			console.log("allMapInfos", allMapInfos);
			setMapInfos(allMapInfos);
		};
		await fetchMapInfos();
		setReload(!reload); // Toggle reload state to trigger re-render if necessary};
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
