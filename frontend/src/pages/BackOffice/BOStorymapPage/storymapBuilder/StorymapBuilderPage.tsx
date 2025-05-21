// import des bibliothèques
import { useContext, useState } from "react";
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
// import des composants
import BlockChoiceForm from "../../../../components/form/storymapForm/blockChoiceForm/BlockChoiceForm";
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
import ModalComponent from "../../../../components/common/modal/ModalComponent";
import DeleteBlockModalContent from "../../../../components/common/modal/DeleteBlockModalContent";
import TableForm from "../../../../components/form/storymapForm/tableForm/TableForm";
import StayConnectedContent from "../../../../components/common/modal/StayConnectedContent";
import ItemLinkForm from "../../../../components/form/storymapForm/itemLinkForm/ItemLinkForm";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des contextes
import { SessionContext } from "../../../../context/SessionContext";
// import des services
import { useShallow } from "zustand/shallow";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useModalStore } from "../../../../utils/stores/storymap/modalStore";
import { updateBlocksPosition } from "../../../../utils/api/storymap/getRequests";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { DragEndEvent } from "@dnd-kit/core";
// import du style
import style from "./storymapBuilderPage.module.scss";
// import des icônes
import { ChevronLeft } from "lucide-react";

/**
 * Page contenant un panel avec la liste des blocs de la storymap et des formulaires pour ajouter de nouveaux blocs
 */
const StorymapBuilderPage = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données du contexte
	const { isTimeoutReached } = useContext(SessionContext);

	// récupération des données des stores
	const { formType, updateFormType } = useBuilderStore(
		useShallow((state) => state),
	);
	const { isDeleteModalOpen, closeDeleteModal } = useModalStore();

	// récupération des paramètres de l'url
	const [_, setSearchParams] = useSearchParams();

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

	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragEnd = (event: DragEndEvent) => {
		try {
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
		<main className={style.storymapBuilderContainer}>
			{isDeleteModalOpen && (
				<ModalComponent onClose={() => closeDeleteModal()}>
					<DeleteBlockModalContent />
				</ModalComponent>
			)}
			{isTimeoutReached && (
				<ModalComponent onClose={() => closeDeleteModal()}>
					<StayConnectedContent />
				</ModalComponent>
			)}
			<section className={style.storymapBuilderPanelSection}>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={blockList.map((b) => b.id)}
						strategy={verticalListSortingStrategy}
					>
						<PanelSection blockList={blockList} setBlockList={setBlockList} />
					</SortableContext>
				</DndContext>
			</section>
			<section className={style.storymapBuilderFormSection}>
				{formType !== "blockChoice" && (
					<button
						type="button"
						onClick={() => {
							updateFormType("blockChoice");
							setSearchParams(undefined);
						}}
					>
						<ChevronLeft />
						{translation[language].common.back}
					</button>
				)}

				{formComponent}
			</section>
		</main>
	);
};

export default StorymapBuilderPage;
