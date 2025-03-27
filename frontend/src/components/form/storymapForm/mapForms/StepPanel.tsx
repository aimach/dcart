// import des bibliothèques
import { useEffect, useState } from "react";
import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	closestCenter,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
// import des composants
import MemoDraggableBlock from "../../../storymap/panel/DraggableBlock";
// import du context
// import des services
import { getBlockInfos } from "../../../../utils/api/storymap/getRequests";
import { updateBlocksPosition } from "../../../../utils/api/storymap/getRequests";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { DragEndEvent } from "@dnd-kit/core";
// import du style
import style from "./mapForms.module.scss";

interface StepPanelProps {
	scrollMapId: string | null;
}

/**
 * Affiche la liste des blocs de la carte déroulante
 * @param scrollMapId - id de la carte déroulante
 * @returns DraggableBlock
 */
const StepPanel = ({ scrollMapId }: StepPanelProps) => {
	// récupération des données des stores
	const { reload } = useBuilderStore();

	// chargement des données de la carte déroulante
	const [scrollMapBlocks, setScrollMapBlocks] = useState<BlockContentType[]>(
		[],
	);
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const fetchScrollMapInfos = async () => {
			const response = await getBlockInfos(scrollMapId as string);
			setScrollMapBlocks(response.children);
		};
		if (scrollMapId) fetchScrollMapInfos();
	}, [reload]);

	// -- DRAG AND DROP --
	const sensors = useSensors(useSensor(PointerSensor));

	function handleDragEnd(event: DragEndEvent) {
		try {
			const { active, over } = event;
			if (!over || active.id === over.id) return; // Si l'élément n'a pas été déplacé

			setScrollMapBlocks((prevBlocks) => {
				const oldIndex = prevBlocks.findIndex((b) => b.id === active.id);
				const newIndex = prevBlocks.findIndex((b) => b.id === over.id);
				updateBlocksPosition(arrayMove(prevBlocks, oldIndex, newIndex));
				return arrayMove(prevBlocks, oldIndex, newIndex);
			});
		} catch (error) {
			console.error(error);
		}
	}

	const { setNodeRef } = useDroppable({
		id: "step-droppable",
	});

	return (
		<section ref={setNodeRef} className={style.stepPanelSection}>
			<h4>Liste des étapes de la carte déroulante</h4>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={scrollMapBlocks.map((b) => b.id)}
					strategy={verticalListSortingStrategy}
				>
					{scrollMapBlocks.length > 0 &&
						scrollMapBlocks.map((block, index) => (
							<MemoDraggableBlock
								block={block}
								key={block.id}
								type="step"
								index={index}
							/>
						))}
				</SortableContext>
			</DndContext>
		</section>
	);
};

export default StepPanel;
