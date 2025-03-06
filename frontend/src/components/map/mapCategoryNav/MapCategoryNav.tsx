import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { getAllCategoriesWithMapsInfos } from "../../../utils/api/getRequests";
// import des types
import type { CategoryType } from "../../../utils/types/mapTypes";
// import du style
import style from "./mapCategoryNav.module.scss";
// import des images
import delta from "../../../assets/delta.png";

/**
 * Composant de navigation dans les catégories et les cartes associées
 */
const MapCategoryNav = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// état pour stocker les catégories avec cartes
	const [categoriesWithMaps, setCategoriesWithMaps] = useState<CategoryType[]>(
		[],
	);

	// état pour gérer la catégorie sélectionnée
	const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
		null,
	);

	// état pour gérer la sélection de la carte "exploration"
	const [selectedExploration, setSelectedExploration] = useState(false);

	//fonction pour récupérer les catégories et les cartes associées
	const fetchCategoriesWithMaps = useCallback(async () => {
		const categories = await getAllCategoriesWithMapsInfos();
		setCategoriesWithMaps(categories ?? []);
	}, []);

	// chargement des catégories et des cartes associées au montage du composant
	useEffect(() => {
		fetchCategoriesWithMaps();
	}, [fetchCategoriesWithMaps]);

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
							<Link to="all/map/exploration">
								{translation[language].button.freeExploration}
							</Link>
						</li>
						<span
							className={
								selectedExploration ? style.selectedCategoryUnderline : ""
							}
						/>
					</div>
					{categoriesWithMaps?.map((category) => {
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
