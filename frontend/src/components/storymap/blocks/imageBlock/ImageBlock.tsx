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
				src={blockContent.content1_lang1}
				alt={blockContent.content2_lang1}
			/>
			<p>{blockContent.content2_lang1}</p>
		</section>
	);
};

export default ImageBlock;
