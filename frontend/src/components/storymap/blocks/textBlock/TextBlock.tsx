// import des bibiliothèques
import DOMPurify from "dompurify";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./textBlock.module.scss";
import "quill/dist/quill.snow.css";

interface TextBlockProps {
	blockContent: BlockContentType;
}

const TextBlock = ({ blockContent }: TextBlockProps) => {
	// on récupère le language
	const { language } = useTranslation();

	// on nettoie le contenu

	const sanitizedText = DOMPurify.sanitize(blockContent.content1_lang1, {
		ALLOWED_TAGS: [
			"p",
			"b",
			"i",
			"u",
			"strong",
			"em",
			"a",
			"ul",
			"ol",
			"li",
			"br",
			"span",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"blockquote",
			"pre",
		],
		ALLOWED_ATTR: ["href", "target", "rel", "class", "style"],
	});

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
