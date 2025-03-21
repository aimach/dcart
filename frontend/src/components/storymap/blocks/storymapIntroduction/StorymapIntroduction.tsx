// import des services
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { StorymapType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./storymapIntroduction.module.scss";

interface StorymapIntroductionProps {
	introductionContent: StorymapType;
}

const StorymapIntroduction = ({
	introductionContent,
}: StorymapIntroductionProps) => {
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	return (
		<section
			className={style.introductionContainer}
			style={{ backgroundImage: `url(${introductionContent.image_url})` }}
		>
			<div className={style.contentContainer}>
				<h2>{introductionContent[`title_${selectedLanguage}`]}</h2>
				<p>{introductionContent[`description_${selectedLanguage}`]}</p>
				{introductionContent.author && <p>{introductionContent.author}</p>}
				{introductionContent.publishedAt && (
					<p>{introductionContent.publishedAt}</p>
				)}
			</div>
		</section>
	);
};

export default StorymapIntroduction;
