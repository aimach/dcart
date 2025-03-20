// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import "./linkBlock.module.scss";

interface LinkBlockProps {
	blockContent: BlockContentType;
}

const LinkBlock = ({ blockContent }: LinkBlockProps) => {
	// on récupère le language
	const { language } = useTranslation();

	return (
		<a href={blockContent.content2_lang1}>{blockContent.content1_lang1}</a>
	);
};

export default LinkBlock;
