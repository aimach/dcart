import { useState, useEffect, useContext } from "react";
// import des composants
import NavComponent from "../../common/NavComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { getAllCategoriesWithMapsInfos } from "../../../utils/loaders/loaders";
// import des types
import type { CategoryType } from "../../../types/mapTypes";
import type { NavList } from "../../../types/commonTypes";
// import du style
import style from "./mapCategoryNav.module.scss";

const MapCategoryNav = () => {
	// on récupère la langue
	const { language } = useContext(TranslationContext);

	// on récupère les données des cartes dans la BDD
	const [allCategoriesWithMaps, setAllCategoriesWithMaps] = useState<
		CategoryType[]
	>([]);
	const [categoryMapList, setCategoryMapList] = useState<NavList>([]);

	// Fonction pour charger les informations des cartes
	const fetchAllCategoriesInfos = async () => {
		try {
			const categories = await getAllCategoriesWithMapsInfos();
			setAllCategoriesWithMaps(categories);
		} catch (error) {
			console.error("Erreur lors du chargement des catégories:", error);
		}
	};

	// Met à jour la liste des cartes dès que allMapsInfos change
	useEffect(() => {
		if (allCategoriesWithMaps.length > 0) {
			const categoryList = allCategoriesWithMaps.map((category) => ({
				id: category.id,
				title: category[`name_${language}`],
				onClickFunction: undefined, // Ajoutez une fonction ici si nécessaire
				route: `${category.id}`,
			}));
			setCategoryMapList(categoryList);
		}
	}, [allCategoriesWithMaps, language]);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchAllCategoriesInfos();
	}, []);

	return (
		<NavComponent
			type="route"
			navClassName={style.mapCategoryNav}
			list={categoryMapList}
			activeLinkClassName={style.mapCategoryNavActive}
		/>
	);
};

export default MapCategoryNav;
