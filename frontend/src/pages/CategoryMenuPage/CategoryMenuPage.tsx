// import des bibliothèques
import { useContext } from "react";
// import des composants
import MapCategoryNav from "../../components/map/mapCategoryNav/MapCategoryNav";
import TitleAndTextComponent from "../../components/common/titleAndText/TitleAndTextComponent";
import ButtonComponent from "../../components/common/button/ButtonComponent";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import du style
import style from "./categoryMenuPage.module.scss";

const CategoryMenuPage = () => {
	// on récupère le language
	const { language, translation } = useContext(TranslationContext);

	return (
		<section className={style.categoryMenu}>
			<div className={style.categoryMenuButtonContainer}>
				<TitleAndTextComponent
					title={translation[language].navigation.explore as string}
					text={translation[language].mapPage.introduction as string}
				/>
				{/* <ButtonComponent
					type="route"
					color="gold"
					textContent={translation[language].button.freeExploration as string}
					link="all/map/exploration"
				/> */}
			</div>
			<div className={style.categoryMenuNavContainer}>
				<MapCategoryNav />
			</div>
		</section>
	);
};

export default CategoryMenuPage;
