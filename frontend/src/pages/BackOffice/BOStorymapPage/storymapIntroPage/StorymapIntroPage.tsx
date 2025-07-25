// import des bibliothèques
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	closestCenter,
	DragOverlay,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";
// import des composants
import IntroductionForm from "../../../../components/form/storymapForm/introductionForm/IntroductionForm";
import ModalComponent from "../../../../components/common/modal/ModalComponent";
import LinkForm from "../../../../components/form/storymapForm/linkForm/LinkForm";
import SimpleMapForm from "../../../../components/form/storymapForm/mapForms/SimpleMapForm";
import QuoteForm from "../../../../components/form/storymapForm/quoteForm/QuoteForm";
import SubtitleForm from "../../../../components/form/storymapForm/SubtitleForm.tsx/SubtitleForm";
import TextForm from "../../../../components/form/storymapForm/textForm/TextForm";
import TitleForm from "../../../../components/form/storymapForm/titleForm/TitleForm";
import ComparisonMapForm from "../../../../components/form/storymapForm/mapForms/ComparisonMapForm";
import ScrollMapForm from "../../../../components/form/storymapForm/mapForms/ScrollMapForm";
import ImageForm from "../../../../components/form/storymapForm/imageForm/imageForm";
import LayoutForm from "../../../../components/form/storymapForm/layoutForm/LayoutForm";
import PanelSection from "../../../../components/storymap/panel/PanelSection";
import DeleteBlockModalContent from "../../../../components/common/modal/DeleteBlockModalContent";
import TableForm from "../../../../components/form/storymapForm/tableForm/TableForm";
import BlockChoiceForm from "../../../../components/form/storymapForm/blockChoiceForm/BlockChoiceForm";
import ButtonComponent from "../../../../components/common/button/ButtonComponent";
import ItemLinkForm from "../../../../components/form/storymapForm/itemLinkForm/ItemLinkForm";
import DraggableBlockOverlay from "../../../../components/storymap/panel/DraggableBlockOverlay";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useShallow } from "zustand/shallow";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useModalStore } from "../../../../utils/stores/storymap/modalStore";
import { updateBlocksPosition } from "../../../../utils/api/storymap/getRequests";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { DragEndEvent } from "@dnd-kit/core";
// import du style
import style from "./storymapIntroPage.module.scss";

/**
 * Page d'introduction à la création d'une storymap : définition du titre, de la description, de l'image de couverture, etc.
 * @returns IntroductionForm
 */
const StorymapIntroPage = () => {
	const { translation, language } = useTranslation();

	const [step, setStep] = useState(1);

	// récupération des données des stores
	const { formType, updateFormType, updateBlockContent } = useBuilderStore(
		useShallow((state) => ({
			formType: state.formType,
			updateFormType: state.updateFormType,
			updateBlockContent: state.updateBlockContent,
		})),
	);
	const { isDeleteModalOpen, closeDeleteModal } = useModalStore();

	const { storymapId } = useParams();

	const { state } = useLocation();
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (!state) return;
		if (state?.from.includes("/storymaps/preview/")) {
			setStep(2);
			updateFormType("blockChoice");
			updateBlockContent(null);
		}
	}, [state]);

	// définition du formulaire à afficher
	let formComponent: JSX.Element = <BlockChoiceForm />;

	switch (formType) {
		case "title":
			formComponent = <TitleForm />;
			break;
		case "subtitle":
			formComponent = <SubtitleForm />;
			break;
		case "text":
			formComponent = <TextForm />;
			break;
		case "image":
			formComponent = <ImageForm />;
			break;
		case "link":
			formComponent = <LinkForm />;
			break;
		case "itemLink":
			formComponent = <ItemLinkForm />;
			break;
		case "quote":
			formComponent = <QuoteForm />;
			break;
		case "layout":
			formComponent = <LayoutForm />;
			break;
		case "table":
			formComponent = <TableForm />;
			break;
		case "simple_map":
			formComponent = <SimpleMapForm />;
			break;
		case "comparison_map":
			formComponent = <ComparisonMapForm />;
			break;
		case "scroll_map":
			formComponent = <ScrollMapForm />;
			break;
		default:
			formComponent = <BlockChoiceForm />;
	}

	// -- DRAG AND DROP --
	const [blockList, setBlockList] = useState<BlockContentType[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(useSensor(PointerSensor));

	const activeBlock = blockList.find((b) => b.id === activeId);

	const handleDragEnd = (event: DragEndEvent) => {
		try {
			setActiveId(null);
			const { active, over } = event;
			if (!over || active.id === over.id) return; // Si l'élément n'a pas été déplacé

			setBlockList((prevBlocks) => {
				const oldIndex = prevBlocks.findIndex((b) => b.id === active.id);
				const newIndex = prevBlocks.findIndex((b) => b.id === over.id);
				updateBlocksPosition(arrayMove(prevBlocks, oldIndex, newIndex));
				return arrayMove(prevBlocks, oldIndex, newIndex);
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<section className={style.BOStorymapFormPageContainer}>
			{isDeleteModalOpen && (
				<ModalComponent onClose={() => closeDeleteModal()}>
					<DeleteBlockModalContent />
				</ModalComponent>
			)}
			<aside className={style.storymapFormAside}>
				<div className={style.storymapFormAsideHeader}>
					{storymapId !== "create" && (
						<ButtonComponent
							type="route"
							color="brown"
							textContent={
								translation[language].backoffice.storymapFormPage.preview
							}
							link={`/backoffice/storymaps/preview/${storymapId}`}
						/>
					)}
				</div>

				<ul>
					<li
						onClick={() => setStep(1)}
						onKeyUp={() => setStep(1)}
						className={step === 1 ? style.isSelected : ""}
					>
						Introduction
					</li>
					{storymapId !== "create" && (
						<li
							onClick={() => {
								setStep(2);
								updateFormType("blockChoice");
							}}
							onKeyUp={() => {
								setStep(2);
								updateFormType("blockChoice");
							}}
							className={step === 2 ? style.isSelected : ""}
						>
							Blocs
						</li>
					)}
				</ul>
				{storymapId !== "create" && step === 2 && (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
						onDragStart={({ active }) => setActiveId(active.id as string)}
					>
						<SortableContext
							items={blockList.map((b) => b.id)}
							strategy={verticalListSortingStrategy}
						>
							<PanelSection
								blockList={blockList}
								setBlockList={setBlockList}
								activeId={activeId}
							/>
						</SortableContext>
						<DragOverlay>
							{activeBlock ? (
								<DraggableBlockOverlay
									block={activeBlock}
									type={activeBlock.type.name === "layout" ? "layout" : "block"}
								/>
							) : null}
						</DragOverlay>
					</DndContext>
				)}
			</aside>
			<section className={style.storymapFormContent}>
				{step === 1 && <IntroductionForm setStep={setStep} />}
				{step === 2 && formComponent}
			</section>
		</section>
	);
};

export default StorymapIntroPage;
