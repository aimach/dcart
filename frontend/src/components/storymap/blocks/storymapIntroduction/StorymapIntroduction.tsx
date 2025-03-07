// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
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
	// on récupère le language
	const { language } = useTranslation();

	return (
		<section
			className={style.introductionContainer}
			style={{ backgroundImage: `url(${introductionContent.image_url})` }}
		>
			<div className={style.contentContainer}>
				<h2>{introductionContent[`title_${language}`]}</h2>
				<p>{introductionContent[`description_${language}`]}</p>
				{introductionContent.author && <p>{introductionContent.author}</p>}
				{introductionContent.publishedAt && (
					<p>{introductionContent.publishedAt}</p>
				)}
			</div>
		</section>
	);
};

export default StorymapIntroduction;
