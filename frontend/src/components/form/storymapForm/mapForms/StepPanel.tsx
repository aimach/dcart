// import des bibliothèques
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
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
import ButtonComponent from "../../../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
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
	scrollMapContent: BlockContentType;
}

/**
 * Affiche la liste des blocs de la carte déroulante
 * @param scrollMapId - id de la carte déroulante
 * @returns DraggableBlock
 */
const StepPanel = ({ scrollMapContent }: StepPanelProps) => {
	const { translation, language } = useTranslation();
	// récupération des données des stores
	const { reload, updateBlockContent } = useBuilderStore();

	// récupération des paramètres de l'url
	const [searchParams, setSearchParams] = useSearchParams();
	const stepAction = searchParams.get("stepAction");

	// chargement des données de la carte déroulante
	const [scrollMapBlocks, setScrollMapBlocks] = useState<BlockContentType[]>(
		[],
	);
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const fetchScrollMapInfos = async () => {
			const response = await getBlockInfos(scrollMapContent.id as string);
			setScrollMapBlocks(response.children);
		};
		if (scrollMapContent?.id) fetchScrollMapInfos();
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

	const handleNewStep = () => {
		setSearchParams({
			stepAction: "create",
		});
		updateBlockContent(scrollMapContent);
	};

	return (
		<section ref={setNodeRef} className={style.stepPanelSection}>
			<h4>
				{
					translation[language].backoffice.storymapFormPage.form
						.scrollMapStepList
				}
			</h4>
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
					{stepAction === "edit" && (
						<ButtonComponent
							type="button"
							color="brown"
							textContent={
								translation[language].backoffice.storymapFormPage.form.addAStep
							}
							onClickFunction={handleNewStep}
						/>
					)}
				</SortableContext>
			</DndContext>
		</section>
	);
};

export default StepPanel;
