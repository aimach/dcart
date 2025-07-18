// import des bibiliothèques
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
// import des composants
import StorymapIntroduction from "../../../../components/storymap/blocks/storymapIntroduction/StorymapIntroduction";
import SeparatorBlock from "../../../../components/storymap/blocks/separatorBlock/SeparatorBlock";
import TextBlock from "../../../../components/storymap/blocks/textBlock/TextBlock";
import LinkBlock from "../../../../components/storymap/blocks/linkBlock/LinkBlock";
import ComparisonMapBlock from "../../../../components/storymap/blocks/comparisonMapBlock/ComparisonMapBlock";
import ScrolledMapBlock from "../../../../components/storymap/blocks/scrolledMapBlock/ScrolledMapBlock";
import QuoteBlock from "../../../../components/storymap/blocks/quoteBlock/QuoteBlock";
import ImageBlock from "../../../../components/storymap/blocks/imageBlock/ImageBlock";
import LayoutBlock from "../../../../components/storymap/blocks/layoutBlock/LayoutBlock";
import TitleBlock from "../../../../components/storymap/blocks/titleBlock/TitleBlock";
import SimpleMapBlock from "../../../../components/storymap/blocks/simpleMapBlock/SimpleMapBlock";
import TableBlock from "../../../../components/storymap/blocks/tableBlock/TableBlock";
import ButtonComponent from "../../../../components/common/button/ButtonComponent";
import ItemLinkBlock from "../../../../components/storymap/blocks/itemLinkBlock/ItemLinkBlock";
import StorymapConclusion from "../../../../components/storymap/blocks/storymapConclusion/StorymapConclusion";
import { StorymapPageHelmetContent } from "../../../../components/helmet/HelmetContent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
import {
	getStorymapInfosAndBlocksById,
	getStorymapInfosAndBlocksBySlug,
} from "../../../../utils/api/storymap/getRequests";
// import des types
import type {
	BlockContentType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
// import du style
import style from "./storymapPage.module.scss";
import "quill/dist/quill.snow.css";

export const getBlockComponentFromType = (
	block: BlockContentType,
	index: number,
) => {
	const key = block.position || index;
	switch (block.type.name) {
		case "title":
			return <TitleBlock key={key} blockContent={block} />;
		case "subtitle":
			return <TitleBlock key={key} blockContent={block} />;
		case "text":
			return <TextBlock key={key} blockContent={block} />;
		case "image":
			return <ImageBlock key={key} blockContent={block} />;
		case "link":
			return <LinkBlock key={key} blockContent={block} />;
		case "itemLink":
			return <ItemLinkBlock key={key} blockContent={block} />;
		case "separator":
			return <SeparatorBlock key={key} />;
		case "quote":
			return <QuoteBlock key={key} blockContent={block} />;
		case "layout":
			return <LayoutBlock key={key} blockContent={block} />;
		case "table":
			return <TableBlock key={key} blockContent={block} />;
		case "simple_map": {
			const mapName = `simple-map-${uuidv4()}`;
			return (
				<SimpleMapBlock key={key} blockContent={block} mapName={mapName} />
			);
		}
		case "comparison_map": {
			const mapName = `comparison-map-${uuidv4()}`;
			return (
				<ComparisonMapBlock key={key} blockContent={block} mapName={mapName} />
			);
		}
		case "scroll_map": {
			const mapName = `map-${uuidv4()}`;
			return (
				<ScrolledMapBlock key={key} blockContent={block} mapName={mapName} />
			);
		}
		default:
			console.error(`Unsupported block type: ${block.type}`);
			return null;
	}
};

const StorymapPage = () => {
	const { translation, language } = useTranslation();

	// récupération de l'id de la storymap
	const { storymapSlug, storymapId } = useParams();

	// récupération de l'url
	const location = useLocation();

	// récupération des données des stores
	const { hasGrayScale, setHasGrayScale } = useMapStore();
	const { selectedLanguage, setSelectedLanguage } = useStorymapLanguageStore();

	// déclaration d'un état pour stocker les informations de la storymap
	const [storymapInfos, setStorymapInfos] = useState<StorymapType | null>(null);

	// au montage du composant, récupération des informations de la storymap
	useEffect(() => {
		const fetchStorymapInfos = async () => {
			if (storymapSlug) {
				const response = await getStorymapInfosAndBlocksBySlug(
					storymapSlug as string,
				);
				setStorymapInfos(response);
			}
			if (storymapId) {
				const response = await getStorymapInfosAndBlocksById(
					storymapId as string,
				);
				setStorymapInfos(response);
			}
		};
		fetchStorymapInfos();
	}, [storymapSlug, storymapId]);

	return (
		storymapInfos && (
			<>
				<StorymapPageHelmetContent
					storymapName={storymapInfos.title_lang1 as string}
				/>
				<div className={style.storymapHeaderContainer}>
					{location.pathname.includes("storymaps/preview/") && (
						<div>
							<Link
								to={`/backoffice/storymaps/${storymapInfos.id}`}
								state={{ from: location.pathname }}
							>
								<ButtonComponent
									type="button"
									textContent={
										translation[language].backoffice.storymapFormPage.backToEdit
									}
									color="gold"
								/>
							</Link>
						</div>
					)}
					<div className={style.linkAndLanguageContainer}>
						{storymapInfos.lang2?.name && (
							<ul className={style.languageSelectionContainer}>
								<li
									onClick={() => setSelectedLanguage("lang1")}
									onKeyUp={() => setSelectedLanguage("lang1")}
									style={
										selectedLanguage === "lang1" ? { fontWeight: "bold" } : {}
									}
								>
									{storymapInfos.lang1.name.toUpperCase()}
								</li>
								<li
									onClick={() => setSelectedLanguage("lang2")}
									onKeyUp={() => setSelectedLanguage("lang2")}
									style={
										selectedLanguage === "lang2" ? { fontWeight: "bold" } : {}
									}
								>
									{storymapInfos.lang2.name.toUpperCase()}
								</li>
							</ul>
						)}
					</div>
					<div className={style.grayScaleToggleContainer}>
						<input
							type="checkbox"
							id="grayScaleToggle"
							onChange={() => setHasGrayScale(!hasGrayScale)}
							checked={hasGrayScale}
						/>
						<label htmlFor="grayScaleToggle">
							{translation[language].button.grey}
						</label>
					</div>
				</div>
				<section className={style.storymapContainer}>
					<StorymapIntroduction
						introductionContent={storymapInfos as StorymapType}
					/>
					{storymapInfos.blocks &&
						(storymapInfos.blocks as BlockContentType[]).map((block, index) =>
							getBlockComponentFromType(block, index),
						)}
					<StorymapConclusion storymapInfos={storymapInfos} />
				</section>
			</>
		)
	);
};

export default StorymapPage;
