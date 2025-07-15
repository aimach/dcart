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
import { useBuilderStore } from "../../../utils/stores/storymap/builderStore";
import {
	getBlockInfos,
	getStorymapInfosAndBlocksById,
} from "../../../utils/api/storymap/getRequests";
import { notifyDeleteSuccess } from "../../../utils/functions/toast";
import { getBlockComponentFromType } from "../../../pages/BackOffice/BOStorymapPage/storymapPage/StorymapPage";

interface UpdatePointSetContentProps {
	idToUpdate: string;
	setIsModalOpen: (isOpen: boolean) => void;
	reload: boolean;
	setReload: (reload: boolean) => void;
	mapType: "map" | "storymap";
	pointType?: "bdd" | "custom";
}

/**
 * Affiche le contenu du modal de nettoyage des points d'un jeu de points : texte de validation et boutons de confirmation (oui/non)
 */
const UpdatePointSetContent = ({
	idToUpdate,
	setIsModalOpen,
	reload,
	setReload,
	mapType,
	pointType = "bdd", // valeur par défaut
}: UpdatePointSetContentProps) => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	const { mapInfos, setMapInfos } = useMapFormStore(
		useShallow((state) => state),
	);

	const { block, updateBlockContent } = useBuilderStore();

	const handlePointSetCleaning = async (idToUpdate: string) => {
		await cleanPointSet(idToUpdate, pointType, mapType);
		notifyDeleteSuccess("Points", false);
		setIsModalOpen(false);
		if (mapType === "map") {
			const fetchMapInfos = async () => {
				const allMapInfos = await getOneMapInfosById(mapInfos?.id as string);
				setMapInfos(allMapInfos);
			};
			await fetchMapInfos();
		}
		if (mapType === "storymap") {
			const fetchBlockInfos = async (blockId: string) => {
				const newBlockInfos = await getBlockInfos(blockId as string);
				updateBlockContent(newBlockInfos);
			};
			fetchBlockInfos(block?.id as string);
		}
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
