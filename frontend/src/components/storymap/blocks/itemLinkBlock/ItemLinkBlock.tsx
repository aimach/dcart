// import des custom hooks
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./itemlinkBlock.module.scss";

interface ItemLinkBlockProps {
	blockContent: BlockContentType;
}

const ItemLinkBlock = ({ blockContent }: ItemLinkBlockProps) => {
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

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
