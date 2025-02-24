// import des bibliothèques
import { useContext } from "react";
// import des composants
import LocationFilterComponent from "../filterComponents/LocationFilterComponent";
import LanguageFilterComponent from "../filterComponents/LanguageFilterComponent";
import ElementFilterComponent from "../filterComponents/ElementFilterComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { getAllPointsByMapId } from "../../../utils/loaders/loaders";
import { useShallow } from "zustand/shallow";
// import des types
import type { MapInfoType } from "../../../utils/types/mapTypes";
import type { UserFilterType } from "../../../utils/types/filterTypes";
import type { OptionType } from "../../../utils/types/commonTypes";
// import du style
import style from "./tabComponent.module.scss";

interface FilterComponentProps {
	locationOptions: OptionType[];
	locationLevel: string;
	elementOptions: OptionType[];
}

const FilterComponent = ({
	locationOptions,
	locationLevel,
	elementOptions,
}: FilterComponentProps) => {
	// on récupère les données de la langue
	const { translation, language } = useContext(TranslationContext);

	// on récupère les données depuis les stores
	const mapFilters = useMapAsideMenuStore((state) => state.mapFilters);
	const { userFilters, resetUserFilters, isReset, setIsReset } =
		useMapFiltersStore(
			useShallow((state) => ({
				userFilters: state.userFilters,
				resetUserFilters: state.resetUserFilters,
				isReset: state.isReset,
				setIsReset: state.setIsReset,
			})),
		);
	const { mapInfos, setAllPoints, setMapReady } = useMapStore(
		useShallow((state) => state),
	);

	// on créé une fonction de chargements des points de la carte avec filtres
	const fetchAllPoints = async (type: string) => {
		try {
			setMapReady(false);
			let points = [];
			if (type === "filter") {
				points = await getAllPointsByMapId(
					(mapInfos as MapInfoType).id as string,
					userFilters as UserFilterType,
				);
			} else if (type === "reset") {
				points = await getAllPointsByMapId(
					((mapInfos as MapInfoType).id as string) ?? "exploration",
					null,
				);
			}
			setAllPoints(points);
			setMapReady(true);
		} catch (error) {
			console.error("Erreur lors du chargement des points:", error);
		}
	};

	const handleFilterButton = () => {
		fetchAllPoints("filter");
	};

	// on créé une fonction pour gérer le reset des filtres
	const resetFilters = () => {
		resetUserFilters();
		setIsReset(!isReset);
		// on recharge les points de la carte
		fetchAllPoints("reset");
	};

	return mapFilters.length ? (
		<div className={style.resultContainer}>
			<div>
				{mapFilters.map((filter) => {
					if (filter.type === "location") {
						return (
							<div className={style.filterContainer}>
								<h4>{translation[language].mapPage.aside.location}</h4>
								<LocationFilterComponent
									key={filter.id}
									locationOptions={locationOptions}
									locationLevel={locationLevel}
								/>
							</div>
						);
					}
					if (filter.type === "element") {
						return (
							<div className={style.filterContainer}>
								<h4>{translation[language].mapPage.aside.element}</h4>
								<ElementFilterComponent
									key={filter.id}
									elementOptions={elementOptions}
								/>
							</div>
						);
					}
					if (filter.type === "language") {
						return (
							<div className={style.filterContainer}>
								<h4>{translation[language].mapPage.aside.language}</h4>
								<LanguageFilterComponent key={filter.id} />
							</div>
						);
					}
				})}
			</div>
			<div className={style.filterButtonContainer}>
				<button
					className={style.filterButton}
					type="button"
					onClick={handleFilterButton}
				>
					{translation[language].button.filter}
				</button>
				<button
					className={style.filterButton}
					type="button"
					onClick={resetFilters}
				>
					{translation[language].button.resetFilter}
				</button>
			</div>
		</div>
	) : (
		<div>{translation[language].mapPage.aside.noFilter}</div>
	);
};

export default FilterComponent;
