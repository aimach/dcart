// import des custom hooks
import { useEffect, useState } from "react";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
import { getOneMapInfosById } from "../../../../utils/api/builtMap/getRequests";
import { getStorymapInfosAndBlocksById } from "../../../../utils/api/storymap/getRequests";
// import des types
import type {
	BlockContentType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
import type { MapType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./itemlinkBlock.module.scss";

interface ItemLinkBlockProps {
	blockContent: BlockContentType;
}

const ItemLinkBlock = ({ blockContent }: ItemLinkBlockProps) => {
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	const [itemInfos, setItemInfos] = useState<MapType | StorymapType | null>(
		null,
	);
	useEffect(() => {
		const fetchItemInfos = async () => {
			if (blockContent.content1_lang1 === "map") {
				const mapInfos = await getOneMapInfosById(blockContent.content1_lang2);
				if (mapInfos) {
					setItemInfos(mapInfos);
				}
			} else if (blockContent.content1_lang1 === "storymap") {
				const storymapInfos = await getStorymapInfosAndBlocksById(
					blockContent.content1_lang2,
				);
				if (storymapInfos) {
					setItemInfos(storymapInfos);
				}
			}
		};
		fetchItemInfos();
	}, [blockContent]);

	return (
		<a
			href={blockContent[`content2_${selectedLanguage}`]}
			target="_blank"
			rel="noopener noreferrer"
			className={style.linkBlock}
		>
			{blockContent[`content1_${selectedLanguage}`]}
		</a>
	);
};

export default ItemLinkBlock;
