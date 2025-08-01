// import des bibliothèques
import { useEffect } from "react";
import { useParams } from "react-router";
import { useDroppable } from "@dnd-kit/core";
// import des composants
import MemoDraggableBlock from "./DraggableBlock";
// import des services
import { getStorymapInfosAndBlocksById } from "../../../utils/api/storymap/getRequests";
import { useBuilderStore } from "../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { BlockContentType } from "../../../utils/types/storymapTypes";
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./panelSection.module.scss";

interface PanelSectionProps {
	blockList: BlockContentType[];
	setBlockList: Dispatch<SetStateAction<BlockContentType[]>>;
	activeId: string | null;
}

/**
 * Affiche la liste des blocs de la storymap
 * @param blockList - Liste des blocs de la storymap
 * @param setBlockList - fonction de mise à jour de la liste des blocs de la storymap
 * @param activeId - ID du bloc actif
 * @returns DraggableBlock
 */
const PanelSection = ({
	blockList,
	setBlockList,
	activeId,
}: PanelSectionProps) => {
	// récupération des données des stores
	const { formType, reload, storymapInfos, setStorymapInfos } = useBuilderStore(
		useShallow((state) => state),
	);

	const { storymapId } = useParams();

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const fetchStorymapInfos = async () => {
			const response = await getStorymapInfosAndBlocksById(
				storymapId as string,
			);
			setStorymapInfos(response);

			setBlockList(response.blocks);
		};
		fetchStorymapInfos();
	}, [formType, reload]);

	// -- DRAG AND DROP --
	const { setNodeRef } = useDroppable({
		id: "droppable",
	});

	return (
		storymapInfos &&
		blockList && (
			<div ref={setNodeRef} className={style.panelSectionContainer}>
				{blockList.map((block) => (
					<MemoDraggableBlock
						key={block.id}
						block={block}
						type={block.type.name === "layout" ? "layout" : "block"}
						isDragging={block.id === activeId}
					/>
				))}
			</div>
		)
	);
};

export default PanelSection;
