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
		<a href={blockContent[`content2_${language}`]}>
			{blockContent[`content1_${language}`]}
		</a>
	);
};

export default LinkBlock;
