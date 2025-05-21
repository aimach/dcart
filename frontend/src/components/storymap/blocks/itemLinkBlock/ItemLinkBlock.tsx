// import des bibliothèques
import { useEffect, useState } from "react";
import { Link } from "react-router";
// import des services
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
import style from "./itemLinkBlock.module.scss";
// import des icônes
import { BookOpenText, MapPin } from "lucide-react";

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

	const isMap = blockContent.content1_lang1 === "map";

	return (
		itemInfos && (
			<Link
				to={`/${blockContent.content1_lang1}/${itemInfos.slug}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				<div className={style.itemLinkBlock}>
					{itemInfos.image_url && (
						<div
							style={{
								backgroundImage: `url(${itemInfos.image_url})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								width: "100px",
								height: "100px",
							}}
						/>
					)}
					<div className={style.linkText}>
						<div className={style.itemIcon}>
							{isMap ? <MapPin /> : <BookOpenText />}
						</div>
						{isMap
							? itemInfos[`title_fr`]
							: itemInfos[`title_${selectedLanguage}`]}
					</div>
				</div>
			</Link>
		)
	);
};

export default ItemLinkBlock;
