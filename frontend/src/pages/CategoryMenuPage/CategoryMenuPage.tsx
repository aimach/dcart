// import des bibliothèques
import { useContext } from "react";
import { Link } from "react-router";
// import des composants
import MapCategoryNav from "../../components/map/mapCategoryNav/MapCategoryNav";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import du style
import style from "./categoryMenuPage.module.scss";
import TitleAndTextComponent from "../../components/common/titleAndText/TitleAndTextComponent";

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
				<Link
					to="all/map/exploration"
					className={style.categoryMenuActionButton}
				>
					{translation[language].button.freeExploration as string}
				</Link>
			</div>
			<div className={style.categoryMenuNavContainer}>
				<MapCategoryNav />
			</div>
		</section>
	);
};

export default CategoryMenuPage;
