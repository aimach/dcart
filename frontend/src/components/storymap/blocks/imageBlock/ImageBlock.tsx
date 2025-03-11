// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./imageBlock.module.scss";

interface ImageBlockProps {
	blockContent: BlockContentType;
}

const ImageBlock = ({ blockContent }: ImageBlockProps) => {
	// on récupère le language
	const { language } = useTranslation();

	return (
		<section className={style.imageSection}>
			<img
				src={blockContent[`content1_${language}`]}
				alt={blockContent[`content2_${language}`]}
			/>
			<p>{blockContent[`content2_${language}`]}</p>
		</section>
	);
};

export default ImageBlock;
