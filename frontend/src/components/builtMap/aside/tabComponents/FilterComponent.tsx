// import des bibliothèques
import { useCallback, useState } from "react";
// import des composants
import LocationFilterComponent from "../filterComponents/LocationFilterComponent";
import LanguageFilterComponent from "../filterComponents/LanguageFilterComponent";
import ElementFilterComponent from "../filterComponents/ElementFilterComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { getAllPointsByMapId } from "../../../../utils/api/builtMap/getRequests";
import { useShallow } from "zustand/shallow";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
// import du style
import style from "./tabComponent.module.scss";
import DivinityNbComponent from "../filterComponents/DivinityNbFilterComponent";
import SourceTypeFilterComponent from "../filterComponents/SourceTypeFilterComponent";

interface FilterComponentProps {
	locationOptions: OptionType[];
	elementOptions: OptionType[];
	sourceTypeOptions: OptionType[];
}

/**
 * Affiche les filtres de la carte
 * @param {Object} props
 * @param {OptionType[]} props.locationOptions - Liste des options pour le filtre de la localisation
 * @param {OptionType[]} props.elementOptions - Liste des éléments pour le filtre des épithètes
 * @param {OptionType[]} props.sourceTypeOptions - Liste des types de source pour le filtre des épithètes
 * @returns LocationFilterComponent | ElementFilterComponent | LanguageFilterComponent
 */
const FilterComponent = ({
	locationOptions,
	elementOptions,
	sourceTypeOptions,
}: FilterComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données depuis les stores
	const { mapInfos, setAllPoints, setAllResults, setMapReady } = useMapStore(
		useShallow((state) => state),
	);
	const { mapFilters } = useMapAsideMenuStore();
	const {
		userFilters,
		resetUserFilters,
		isReset,
		setIsReset,
		setLocationNames,
		setElementNames,
		setLanguageValues,
		resetLanguageValues,
	} = useMapFiltersStore(useShallow((state) => state));

	// initiation d'états pour récupérer les valeurs des lieux et éléments
	const [locationNameValues, setLocationNameValues] = useState<string[]>([]);
	const [elementNameValues, setElementNameValues] = useState<string[]>([]);
	const [sourceTypeValues, setSourceTypeValues] = useState<string[]>([]);

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
			setAllResults(points);
			setMapReady(true);
		},
		[mapInfos, setAllPoints, setMapReady, userFilters, setAllResults],
	);

	// fonction pour gérer le clic sur le bouton de filtre
	const handleFilterButton = () => {
		fetchAllPoints("filter");
		setLocationNames(locationNameValues);
		setElementNames(elementNameValues);
		setLanguageValues({
			greek: userFilters.greek,
			semitic: userFilters.semitic,
		});
	};

	// fonction pour gérer le reset des filtres
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	const resetFilters = useCallback(() => {
		resetUserFilters();
		setIsReset(!isReset);
		// on recharge les points de la carte
		fetchAllPoints("reset");
		setLocationNames([]);
		setElementNames([]);
		resetLanguageValues();
	}, [fetchAllPoints, resetUserFilters, setIsReset]);

	return (
		<div className={style.resultContainer}>
			<div>
				{mapFilters.length > 0 &&
					mapFilters.map((filter) => {
						if (filter.filter.type === "location") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>{translation[language].mapPage.aside.location}</h4>
									<LocationFilterComponent
										key={filter.id}
										locationOptions={locationOptions}
										setLocationNameValues={setLocationNameValues}
									/>
								</div>
							);
						}
						if (filter.filter.type === "element") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>{translation[language].mapPage.aside.element}</h4>
									<ElementFilterComponent
										key={filter.id}
										elementOptions={elementOptions}
										setElementNameValues={setElementNameValues}
									/>
								</div>
							);
						}
						if (filter.filter.type === "divinityNb") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>{translation[language].mapPage.aside.divinityNb}</h4>
									<DivinityNbComponent key={filter.id} />
								</div>
							);
						}
						if (filter.filter.type === "language") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>{translation[language].mapPage.aside.language}</h4>
									<LanguageFilterComponent key={filter.id} />
								</div>
							);
						}
						if (filter.filter.type === "sourceType") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>{translation[language].mapPage.aside.sourceType}</h4>
									<SourceTypeFilterComponent
										sourceTypeOptions={sourceTypeOptions}
										setSourceTypeValues={setSourceTypeValues}
										key={filter.id}
									/>
								</div>
							);
						}
					})}
				{mapFilters.length === 0 && (
					<div className={style.filterContainer}>
						<h4>{translation[language].mapPage.aside.language}</h4>
						<LanguageFilterComponent />
					</div>
				)}
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
	);
};

export default FilterComponent;
