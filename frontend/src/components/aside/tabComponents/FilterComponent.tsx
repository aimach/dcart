// import des bibliothèques
import { useCallback } from "react";
// import des composants
import LocationFilterComponent from "../filterComponents/LocationFilterComponent";
import LanguageFilterComponent from "../filterComponents/LanguageFilterComponent";
import ElementFilterComponent from "../filterComponents/ElementFilterComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { getAllPointsByMapId } from "../../../utils/api/getRequests";
import { useShallow } from "zustand/shallow";
// import des types
import type { OptionType } from "../../../utils/types/commonTypes";
// import du style
import style from "./tabComponent.module.scss";

interface FilterComponentProps {
	locationOptions: OptionType[];
	elementOptions: OptionType[];
}

/**
 * Affiche les filtres de la carte
 * @param {Object} props
 * @param {OptionType[]} props.locationOptions - Liste des options pour le filtre de la localisation
 * @param {OptionType[]} props.elementOptions - Liste des éléments pour le filtre des épithètes
 * @returns LocationFilterComponent | ElementFilterComponent | LanguageFilterComponent
 */
const FilterComponent = ({
	locationOptions,
	elementOptions,
}: FilterComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données depuis les stores
	const { mapInfos, setAllPoints, setMapReady } = useMapStore(
		useShallow((state) => state),
	);
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

	// fonction de chargements des points de la carte (avec filtres ou non)
	const fetchAllPoints = useCallback(
		async (type: "filter" | "reset") => {
			setMapReady(false);

			const mapId = mapInfos?.id ?? "exploration";
			const points = await getAllPointsByMapId(
				mapId,
				type === "filter" ? userFilters : null,
			);

			setAllPoints(points);
			setMapReady(true);
		},
		[mapInfos, setAllPoints, setMapReady, userFilters],
	);

	// fonction pour gérer le clic sur le bouton de filtre
	const handleFilterButton = useCallback(() => {
		fetchAllPoints("filter");
	}, [fetchAllPoints]);

	// fonction pour gérer le reset des filtres
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	const resetFilters = useCallback(() => {
		resetUserFilters();
		setIsReset(!isReset);
		// on recharge les points de la carte
		fetchAllPoints("reset");
	}, [fetchAllPoints, resetUserFilters, setIsReset]);

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
