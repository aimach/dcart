// import des custom hooks
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./titleBlock.module.scss";

interface TitleBlockProps {
	blockContent: BlockContentType;
}

const TitleBlock = ({ blockContent }: TitleBlockProps) => {
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	return (
		<section className={style.titleSection}>
			{blockContent.type.name === "title" ? (
				<h3 className={style.titleStyle}>
					{blockContent[`content1_${selectedLanguage}`]}
				</h3>
			) : (
				<h4 className={style.subtitleStyle}>
					{blockContent[`content1_${selectedLanguage}`]}
				</h4>
			)}
		</section>
	);
};

export default TitleBlock;
