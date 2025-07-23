// import des bibliothèques
import { useEffect, useState, useMemo } from "react";
// import des composants
import BlockChoiceItem from "./BlockChoiceItem";
import LoaderComponent from "../../../common/loader/LoaderComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { getAllBlockTypes } from "../../../../utils/api/storymap/getRequests";
// import des types
import type { TypeType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./blockChoiceForm.module.scss";

/**
 * Formulaire permettant de choisir le type de bloc à ajouter à la storymap
 */
const BlockChoiceForm = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { updateBlockContent } = useBuilderStore();

	// déclaration d'un état pour stocker les types de blocs
	const [allBlockTypes, setAllBlockTypes] = useState<TypeType[]>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const fetchAllBlockTypes = async () => {
			const allBlockTypes: TypeType[] = await getAllBlockTypes();
			setAllBlockTypes(allBlockTypes);
		};
		fetchAllBlockTypes();
		// réinitialisation du block stocké dans le store
		updateBlockContent(null);
	}, []);

	// préparation des blocs de type "contenu textuel et mise en page"
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	const textAndLayoutBlocks = useMemo(
		() =>
			allBlockTypes
				.filter(
					(blockType) =>
						blockType.name === "title" ||
						blockType.name === "subtitle" ||
						blockType.name === "text" ||
						blockType.name === "quote" ||
						blockType.name === "layout" ||
						blockType.name === "separator" ||
						blockType.name === "table",
				)
				.map((blockType: TypeType) => (
					<BlockChoiceItem key={blockType.id} blockType={blockType} />
				)),
		[allBlockTypes, language],
	);

	// préparation des blocs de type "media"
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	const mediaBlocks = useMemo(
		() =>
			allBlockTypes
				.filter(
					(blockType) =>
						blockType.name === "link" ||
						blockType.name === "itemLink" ||
						blockType.name === "image",
				)
				.map((blockType: TypeType) => (
					<BlockChoiceItem key={blockType.id} blockType={blockType} />
				)),
		[allBlockTypes, language],
	);

	// préparation des blocs de type "carte"
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	const mapBlocks = useMemo(
		() =>
			allBlockTypes
				.filter((blockType) => blockType.name.includes("map"))
				.map((blockType: TypeType) => (
					<BlockChoiceItem key={blockType.id} blockType={blockType} />
				)),
		[allBlockTypes, language],
	);

	return allBlockTypes.length ? (
		<section className={style.blockChoiceFormContainer}>
			<h3>{translation[language].backoffice.storymapFormPage.chooseBlock}</h3>
			<div>
				<h4>{translation[language].backoffice.storymapFormPage.textContent}</h4>
				<ul className={style.blockChoiceFormList}>{textAndLayoutBlocks}</ul>
			</div>
			<div>
				<h4>
					{translation[language].backoffice.storymapFormPage.mediaContent}
				</h4>
				<ul className={style.blockChoiceFormList}>{mediaBlocks}</ul>
			</div>
			<div>
				<h4>{translation[language].backoffice.storymapFormPage.mapsContent}</h4>
				<ul className={style.blockChoiceFormList}>{mapBlocks}</ul>
			</div>
		</section>
	) : (
		<LoaderComponent />
	);
};

export default BlockChoiceForm;
