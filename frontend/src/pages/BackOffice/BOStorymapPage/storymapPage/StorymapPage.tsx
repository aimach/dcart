// import des bibiliothèques
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

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
// import des services
import { getStorymapInfosAndBlocks } from "../../../../utils/api/storymap/getRequests";
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
		case "separator":
			return <SeparatorBlock key={key} />;
		case "quote":
			return <QuoteBlock key={key} blockContent={block} />;
		case "layout":
			return <LayoutBlock key={key} blockContent={block} />;
		case "simple_map": {
			const mapName = `simple-map-${uuidv4()}`;
			return (
				<SimpleMapBlock key={key} blockContent={block} mapName={mapName} />
			);
		}
		case "comparison_map":
			return <ComparisonMapBlock key={key} blockContent={block} />;
		case "scroll_map":
			return <ScrolledMapBlock key={key} blockContent={block} />;
		default:
			console.error(`Unsupported block type: ${block.type}`);
			return null;
	}
};

const StorymapPage = () => {
	const [storymapInfos, setStorymapInfos] = useState<StorymapType | null>(null);
	const { storymapId } = useParams();
	const fetchStorymapInfos = async () => {
		try {
			const response = await getStorymapInfosAndBlocks(storymapId as string);
			setStorymapInfos(response);
		} catch (error) {
			console.error(error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchStorymapInfos();
	}, []);

	return (
		storymapInfos && (
			<>
				<Link to={`/backoffice/storymaps/build/${storymapId}`}>
					Modifier la storymap
				</Link>
				<section className={style.storymapContainer}>
					<StorymapIntroduction
						introductionContent={storymapInfos as StorymapType}
					/>
					{storymapInfos.blocks &&
						(storymapInfos.blocks as BlockContentType[]).map((block, index) =>
							getBlockComponentFromType(block, index),
						)}
				</section>
			</>
		)
	);
};

export default StorymapPage;
