// import des bibliothèques
import { useState, useContext } from "react";
import { Link, useParams, useSearchParams } from "react-router";
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
import IntroductionForm from "../../../../components/form/storymapForm/introductionForm/IntroductionForm";
import ModalComponent from "../../../../components/common/modal/ModalComponent";
import StayConnectedContent from "../../../../components/common/modal/StayConnectedContent";
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
// import du context
import { SessionContext } from "../../../../context/SessionContext";
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
// import des icônes
import { ChevronLeft } from "lucide-react";
import ButtonComponent from "../../../../components/common/button/ButtonComponent";

/**
 * Page d'introduction à la création d'une storymap : définition du titre, de la description, de l'image de couverture, etc.
 * @returns IntroductionForm
 */
const StorymapIntroPage = () => {
	const { translation, language } = useTranslation();
	// récupération des données du contexte
	const { isTimeoutReached } = useContext(SessionContext);

	const [step, setStep] = useState(1);

	// récupération des données des stores
	const { formType, updateFormType } = useBuilderStore(
		useShallow((state) => ({
			formType: state.formType,
			updateFormType: state.updateFormType,
		})),
	);
	const { isDeleteModalOpen, closeDeleteModal } = useModalStore();

	// récupération des paramètres de l'url
	const [_, setSearchParams] = useSearchParams();

	const { storymapId } = useParams();

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
		<section className={style.BOStorymapFormPageContainer}>
			{isDeleteModalOpen && (
				<ModalComponent onClose={() => closeDeleteModal()} isDemo={false}>
					<DeleteBlockModalContent />
				</ModalComponent>
			)}
			{isTimeoutReached && (
				<ModalComponent onClose={() => closeDeleteModal()} isDemo={false}>
					<StayConnectedContent />
				</ModalComponent>
			)}
			<aside className={style.storymapFormAside}>
				{storymapId !== "create" && (
					<div className={style.buttonContainer}>
						<Link to={`/backoffice/storymaps/view/${storymapId}`}>
							<button type="button" className={style.previewButton}>
								{translation[language].backoffice.storymapFormPage.preview}
							</button>
						</Link>
					</div>
				)}

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
					>
						<SortableContext
							items={blockList.map((b) => b.id)}
							strategy={verticalListSortingStrategy}
						>
							<PanelSection blockList={blockList} setBlockList={setBlockList} />
						</SortableContext>
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
