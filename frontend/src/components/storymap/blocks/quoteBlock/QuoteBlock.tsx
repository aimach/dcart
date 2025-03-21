// import des custom hooks
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./quoteBlock.module.scss";

interface QuoteBlockProps {
	blockContent: BlockContentType;
}

const QuoteBlock = ({ blockContent }: QuoteBlockProps) => {
	// import des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	return (
		<div className={style.quoteBlockContainer}>
			<p>{blockContent[`content1_${selectedLanguage}`]}</p>
			<p>{blockContent[`content2_${selectedLanguage}`]}</p>
		</div>
	);
};

export default QuoteBlock;
