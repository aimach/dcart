// import des custom hooks
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./imageBlock.module.scss";

interface ImageBlockProps {
	blockContent: BlockContentType;
}

const ImageBlock = ({ blockContent }: ImageBlockProps) => {
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	return (
		<section className={style.imageSection}>
			<img
				src={blockContent[`content1_${selectedLanguage}`]}
				alt={blockContent[`content2_${selectedLanguage}`]}
				loading="lazy"
			/>
			<p>{blockContent[`content2_${selectedLanguage}`]}</p>
		</section>
	);
};

export default ImageBlock;
