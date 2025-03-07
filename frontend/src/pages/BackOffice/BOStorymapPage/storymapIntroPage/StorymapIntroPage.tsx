// import des composants
import IntroductionForm from "../../../../components/form/storymapForm/introductionForm/IntroductionForm";
// import du style
import style from "./storymapIntroPage.module.scss";

/**
 * Page d'introduction à la création d'une storymap : définition du titre, de la description, de l'image de couverture, etc.
 * @returns IntroductionForm
 */
const StorymapIntroPage = () => {
	return (
		<div className={style.storymapIntroContainer}>
			<IntroductionForm />
		</div>
	);
};

export default StorymapIntroPage;
