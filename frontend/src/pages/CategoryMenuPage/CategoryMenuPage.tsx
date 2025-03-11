// import des composants
import MapCategoryNav from "../../components/builtMap/map/mapCategoryNav/MapCategoryNav";
import TitleAndTextComponent from "../../components/common/titleAndText/TitleAndTextComponent";
// import des hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import du style
import style from "./categoryMenuPage.module.scss";

/**
 * Page de navigation qui présente toutes les catégories et les cartes associées
 * @returns TitleAndTextComponent | MapCategoryNav
 */
const CategoryMenuPage = () => {
	// Récupération des données externes (context, store, params, etc.)
	const { translation, language } = useTranslation();

	return (
		<section className={style.categoryMenu}>
			<div className={style.categoryMenuButtonContainer}>
				<TitleAndTextComponent
					title={translation[language].navigation.explore as string}
					text={translation[language].mapPage.introduction as string}
				/>
			</div>
			<div className={style.categoryMenuNavContainer}>
				<MapCategoryNav />
			</div>
		</section>
	);
};

export default CategoryMenuPage;
