// import des bibliothèques
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDroppable } from "@dnd-kit/core";
// import des composants
import MemoDraggableBlock from "./DraggableBlock";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { getStorymapInfosAndBlocks } from "../../../utils/api/storymap/getRequests";
import { useBuilderStore } from "../../../utils/stores/storymap/builderStore";
// import des types
import type {
	BlockContentType,
	StorymapType,
} from "../../../utils/types/storymapTypes";
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./panelSection.module.scss";
import { useShallow } from "zustand/shallow";

interface PanelSectionProps {
	blockList: BlockContentType[];
	setBlockList: Dispatch<SetStateAction<BlockContentType[]>>;
}

/**
 * Affiche la liste des blocs de la storymap
 * @param blockList - Liste des blocs de la storymap
 * @param setBlockList - fonction de mise à jour de la liste des blocs de la storymap
 * @returns DraggableBlock
 */
const PanelSection = ({ blockList, setBlockList }: PanelSectionProps) => {
	// récupération des données des stores
	const { formType, reload, storymapInfos, setStorymapInfos } = useBuilderStore(
		useShallow((state) => state),
	);

	const { storymapId } = useParams();

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const fetchStorymapInfos = async () => {
			const response = await getStorymapInfosAndBlocks(storymapId as string);
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
					/>
				))}
			</div>
		)
	);
};

export default PanelSection;
