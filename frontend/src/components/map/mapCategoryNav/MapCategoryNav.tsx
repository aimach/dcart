import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
// import des composants
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { getAllCategoriesWithMapsInfos } from "../../../utils/loaders/loaders";
// import des types
import type { CategoryType } from "../../../utils/types/mapTypes";
import type { NavList } from "../../../utils/types/commonTypes";
// import du style
import style from "./mapCategoryNav.module.scss";
// import des images
import delta from "../../../assets/delta.png";

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
				description: category[`description_${language}`],
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

	// on initie un state pour l'apparition des cartes
	const [showMaps, setShowMaps] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
		null,
	);

	// on initie un state pour l'underline d'exploration
	const [selectedExploration, setSelectedExploration] = useState(false);

	return (
		<section className={style.categoryMenu}>
			<nav className={style.categoryMenuNav}>
				<ul>
					<div className={style.categoryNameContainer}>
						<li
							onMouseEnter={() => {
								setSelectedCategory(null);
								setSelectedExploration(true);
							}}
						>
							<Link to="all/map/exploration">Exploration libre</Link>
						</li>
						<span
							className={
								selectedExploration ? style.selectedCategoryUnderline : ""
							}
						/>
					</div>
					{allCategoriesWithMaps.map((category) => {
						return (
							<div key={category.id} className={style.categoryNameContainer}>
								<li
									onMouseEnter={() => {
										setSelectedCategory(category);
										setSelectedExploration(false);
									}}
								>
									{category[`name_${language}`]}
								</li>
								<span
									className={
										category.id === selectedCategory?.id
											? style.selectedCategoryUnderline
											: ""
									}
								/>
							</div>
						);
					})}
				</ul>
			</nav>
			<div className={style.categoryMenuContent}>
				{selectedCategory && (
					<div>
						<div>{selectedCategory.description_fr}</div>
						<ul className={style.mapListContainer}>
							{selectedCategory.maps.map((map) => {
								return (
									<li key={map.id} className={style.mapListItem}>
										<img src={delta} alt="delta" width={30} />
										<Link to={`${selectedCategory.id}/map/${map.id}`}>
											{map[`name_${language}`]}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		</section>
	);
};

export default MapCategoryNav;
