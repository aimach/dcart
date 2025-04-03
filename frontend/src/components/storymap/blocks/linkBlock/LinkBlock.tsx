// import des custom hooks
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import "./linkBlock.module.scss";

interface LinkBlockProps {
	blockContent: BlockContentType;
}

const LinkBlock = ({ blockContent }: LinkBlockProps) => {
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	return (
		<a
			href={blockContent[`content2_${selectedLanguage}`]}
			target="_blank"
			rel="noopener noreferrer"
		>
			{blockContent[`content1_${selectedLanguage}`]}
		</a>
	);
};

export default LinkBlock;
