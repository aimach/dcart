// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./titleBlock.module.scss";

interface TitleBlockProps {
	blockContent: BlockContentType;
}

const TitleBlock = ({ blockContent }: TitleBlockProps) => {
	// on récupère le language
	const { language } = useTranslation();

	return (
		<section className={style.titleSection}>
			{blockContent.type.name === "title" ? (
				<h3 className={style.titleStyle}>
					{blockContent[`content1_${language}`]}
				</h3>
			) : (
				<h4 className={style.subtitleStyle}>
					{blockContent[`content1_${language}`]}
				</h4>
			)}
		</section>
	);
};

export default TitleBlock;
