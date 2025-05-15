// import des bibliothèques
import { useMemo } from "react";
import DOMPurify from "dompurify";
// import des custom hooks
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";
// import des services
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
import { getAllowedTags } from "../../../../utils/functions/block";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./layoutBlock.module.scss";
import "./layoutBlock.css";

interface LayoutBlockProps {
	blockContent: BlockContentType;
}

const LayoutBlock = ({ blockContent }: LayoutBlockProps) => {
	const { selectedLanguage } = useStorymapLanguageStore();

	const { isMobile } = useWindowSize();

	const imageSide = blockContent.content1_lang1;

	const textAndImageBlockInOrder: BlockContentType[] = useMemo(() => {
		const textBlock = blockContent.children.find(
			(child) => child.type.name === "text",
		);
		const imageBlock = blockContent.children.find(
			(child) => child.type.name === "image",
		);
		if (!textBlock || !imageBlock) {
			return [];
		}

		return [imageBlock, textBlock];
	}, [blockContent]);

	return isMobile ? (
		<section className={style.layoutSection}>
			<img
				src={textAndImageBlockInOrder[0][`content1_${selectedLanguage}`]}
				alt={textAndImageBlockInOrder[0][`content2_${selectedLanguage}`]}
			/>
			<div
				// biome-ignore lint/security/noDangerouslySetInnerHtml: le texte est nettoyé avec DOMPurify
				dangerouslySetInnerHTML={{
					__html: DOMPurify.sanitize(
						textAndImageBlockInOrder[1][`content1_${selectedLanguage}`],
						getAllowedTags(),
					),
				}}
				className="ql-editor" // permet d'avoir le style de Quill
			/>
		</section>
	) : (
		<section className={`${style.layoutSection} ${style[imageSide]}`}>
			{textAndImageBlockInOrder.map((child) => {
				if (child.type.name === "text") {
					const sanitizedText = DOMPurify.sanitize(
						child[`content1_${selectedLanguage}`],
						getAllowedTags(),
					);
					return (
						<div
							// biome-ignore lint/security/noDangerouslySetInnerHtml: le texte est nettoyé avec DOMPurify
							dangerouslySetInnerHTML={{ __html: sanitizedText }}
							className="ql-editor" // permet d'avoir le style de Quill
							key={child.id}
						/>
					);
				}
				if (child.type.name === "image") {
					return (
						<figure key={child.id}>
							<img
								src={child[`content1_${selectedLanguage}`]}
								alt={child[`content2_${selectedLanguage}`]}
							/>
							<figcaption>{child[`content2_${selectedLanguage}`]}</figcaption>
						</figure>
					);
				}
			})}
		</section>
	);
};

export default LayoutBlock;
