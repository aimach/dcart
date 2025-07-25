// import des bibliothèques
import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSearchParams } from "react-router";
// import des composants
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useBuilderStore } from "../../../utils/stores/storymap/builderStore";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import { useShallow } from "zustand/shallow";
import {
	getPreviewText,
	getTypeIcon,
	hasRequiredKeys,
} from "../../../utils/functions/block";
import { useStorymapLanguageStore } from "../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type {
	BlockContentType,
	StorymapType,
} from "../../../utils/types/storymapTypes";
// import du style
import {
	draggableBlockActionContainerStyle,
	draggableBlockTextContainerStyle,
	draggableBlockTitleStyle,
} from "./draggableBlockSctyle";
// import des icones
import { Pen, Trash2, TriangleAlert } from "lucide-react";

type DraggableBlockProps = {
	block: BlockContentType;
	type: string;
	index?: number;
	isDragging?: boolean;
};

/**
 * Retourne un composant draggable représentant un bloc de la storymap ou d'une étape
 * Le composant est mémoïsé pour éviter les re-rendus inutiles lors du drag and drop
 * @param block - le bloc à afficher
 * @param type - le type de bloc
 * @param index - l'index du bloc (facultatif)
 * @param isDragging - indique si le bloc est en cours de drag and drop (facultatif)
 */
const DraggableBlock = ({
	block,
	type,
	index,
	isDragging,
}: DraggableBlockProps) => {

	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des paramètres de l'url
	const [_, setSearchParams] = useSearchParams();

	// récupération des données du store
	const { openDeleteModal } = useModalStore();
	const { storymapInfos, updateFormType, updateBlockContent } = useBuilderStore(
		useShallow((state) => state),
	);
	const { selectedLanguage } = useStorymapLanguageStore();

	// récupération de l'icône correspondant au type de bloc
	const icon = getTypeIcon(block.type ? block.type.name : type);

	// définition du texte du titre
	const titleText =
		type === "step"
			? `Etape n°${(index as number) + 1}`
			: translation[language].backoffice.storymapFormPage.types[
					block.type
						.name as keyof typeof translation.en.backoffice.storymapFormPage.types
				];

	// fonction déclenchée lors du clic sur l'icone de modification
	const handleEditClick = () => {
		if (type === "step") {
			setSearchParams({
				stepAction: "edit",
				id: block.id,
			});
		} else {
			setSearchParams({
				action: "edit",
			});
			updateFormType(block.type.name);
		}
		updateBlockContent(block);
	};

	// fonction déclenchée lors du clic sur l'icone de suppression
	const handleDeleteClick = () => {
		updateBlockContent(block);
		openDeleteModal();
	};

	// -- DRAG AND DROP --
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: block.id,
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		display: "flex",
		justifyContent: "space-between",
		border: "1px solid #e0e0e0",
		borderRadius: "5px",
		margin: "10px",
		padding: "10px",
		backgroundColor: "white",
		width: "80%",
		cursor: "grab",
	};

	const previewText = getPreviewText(block, selectedLanguage);
	const displayWarning = hasRequiredKeys(block, storymapInfos as StorymapType);

	return (
		<>
			<div
				ref={setNodeRef}
				style={{
					...style,
					...(isDragging && {
						border: "2px dashed #bbb",
						backgroundColor: "#f9f9f9",
						justifyContent: "center",
						alignItems: "center",
						color: "#999",
						fontStyle: "italic",
					}),
				}}
				{...listeners}
				{...attributes}
			>
				<div style={draggableBlockTitleStyle}>
					{icon}
					<div style={draggableBlockTextContainerStyle}>
						<p>{titleText}</p>
						<br />
						{previewText}
						{displayWarning && (
							<p
								style={{
									color: "#9d2121",
									fontSize: "0.875rem",
									display: "flex",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<TriangleAlert size={20} />{" "}
								{translation[language].alert.missingTranslation}
							</p>
						)}
					</div>
				</div>
				<div style={draggableBlockActionContainerStyle}>
					<Pen
						onMouseDown={handleEditClick}
						size={20}
						style={{ cursor: "pointer" }}
					/>
					<Trash2
						onMouseDown={handleDeleteClick}
						size={20}
						style={{ cursor: "pointer" }}
					/>
				</div>
			</div>
		</>
	);
};

// mémoïsation du composant pour éviter les re-rendus inutiles lors du drag and drop
const MemoDraggableBlock = memo(DraggableBlock);

export default MemoDraggableBlock;
