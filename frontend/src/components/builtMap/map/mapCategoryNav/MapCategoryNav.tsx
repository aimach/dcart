import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { getAllTagsWithMapsInfos } from "../../../../utils/api/builtMap/getRequests";
import { getAllStorymapTags } from "../../../../utils/api/storymap/getRequests";
// import des types
import type { TagType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./mapCategoryNav.module.scss";
// import des images
import delta from "../../../../assets/delta.png";

interface MapCategoryNavProps {
	type: "map" | "storymap";
}

/**
 * Composant de navigation dans les catégories et les cartes associées
 * @param type - type de carte (map ou storymap)
 */
const MapCategoryNav = ({ type }: MapCategoryNavProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// état pour stocker les catégories avec cartes
	const [categoriesWithMaps, setCategoriesWithMaps] = useState<TagType[]>([]);

	// état pour gérer la catégorie sélectionnée
	const [selectedCategory, setSelectedCategory] = useState<TagType | null>(
		null,
	);

	// état pour gérer la sélection de la carte "exploration"
	const [selectedExploration, setSelectedExploration] = useState(false);

	//fonction pour récupérer les catégories et les cartes associées
	const fetchCategoriesWithMaps = useCallback(async () => {
		let categories = [];
		if (type === "map") {
			categories = await getAllTagsWithMapsInfos();
		}
		if (type === "storymap") {
			categories = await getAllStorymapTags();
		}
		setCategoriesWithMaps(categories ?? []);
	}, [type]);

	// chargement des catégories et des cartes associées au montage du composant
	useEffect(() => {
		fetchCategoriesWithMaps();
	}, [fetchCategoriesWithMaps]);

	return (
		<section className={style.categoryMenu}>
			<nav className={style.categoryMenuNav}>
				<ul>
					{type === "map" && (
						<div className={style.categoryNameContainer}>
							<li
								onMouseEnter={() => {
									setSelectedCategory(null);
									setSelectedExploration(true);
								}}
							>
								<Link to="/map/exploration">
									{translation[language].button.freeExploration}
								</Link>
							</li>
							<span
								className={
									selectedExploration ? style.selectedCategoryUnderline : ""
								}
							/>
						</div>
					)}
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
							{selectedCategory[`${type}s`].map((item) => {
								return (
									<li key={item.id} className={style.mapListItem}>
										<img src={delta} alt="delta" width={30} />
										{type === "map" ? (
											<Link to={`/map/${item.id}`}>
												{item[`title_${language}`]}
											</Link>
										) : (
											<Link to={`/storymap/${item.id}`}>
												{item.title_lang1}
											</Link>
										)}
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
