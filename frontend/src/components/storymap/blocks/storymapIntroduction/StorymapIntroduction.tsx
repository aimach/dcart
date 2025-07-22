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

	const backgroundStyle = introductionContent.image_url
		? {
				backgroundImage: `url(${introductionContent.image_url})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}
		: {
				backgroundColor: introductionContent.background_color || "#f0f0f0",
			};

	return (
		<section className={style.introductionContainer} style={backgroundStyle}>
			<div className={style.contentContainer}>
				<h2>{introductionContent[`title_${selectedLanguage}`]}</h2>
				<p>{introductionContent[`description_${selectedLanguage}`]}</p>
				<div className={style.authorAndDateContainer}>
					{introductionContent.author && <p>{introductionContent.author}</p>}
					{introductionContent.author_status && (
						<p>{introductionContent.author_status}</p>
					)}
					{introductionContent.publishedAt && (
						<p>{introductionContent.publishedAt}</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default StorymapIntroduction;
