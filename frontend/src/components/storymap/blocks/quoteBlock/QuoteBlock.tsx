// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./quoteBlock.module.scss";

interface QuoteBlockProps {
	blockContent: BlockContentType;
}

const QuoteBlock = ({ blockContent }: QuoteBlockProps) => {
	const { language } = useTranslation();
	return (
		<div className={style.quoteBlockContainer}>
			<p>{blockContent[`content1_${language}`]}</p>
			<p>{blockContent[`content2_${language}`]}</p>
		</div>
	);
};

export default QuoteBlock;
