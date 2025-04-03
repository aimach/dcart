// import des bibiliothèques
import DOMPurify from "dompurify";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./textBlock.module.scss";
import "quill/dist/quill.snow.css";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
import { getAllowedTags } from "../../../../utils/functions/block";

interface TextBlockProps {
	blockContent: BlockContentType;
}

const TextBlock = ({ blockContent }: TextBlockProps) => {
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	// nettoyage du texte avec DOMPurify
	const sanitizedText = DOMPurify.sanitize(
		blockContent[`content1_${selectedLanguage}`],
		getAllowedTags(),
	);

	return (
		<section className={style.textBlockContainer}>
			<div
				// biome-ignore lint/security/noDangerouslySetInnerHtml: le texte est nettoyé avec DOMPurify
				dangerouslySetInnerHTML={{ __html: sanitizedText }}
				className="ql-editor" // permet d'avoir le style de Quill
			/>
		</section>
	);
};

export default TextBlock;
