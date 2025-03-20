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
			<p>{blockContent.content1_lang1}</p>
			<p>{blockContent.content2_lang1}</p>
		</div>
	);
};

export default QuoteBlock;
