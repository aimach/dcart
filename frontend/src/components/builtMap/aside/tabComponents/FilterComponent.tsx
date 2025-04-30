// import des bibliothèques
import { useCallback, useState } from "react";
// import des composants
import LocationFilterComponent from "../filterComponents/LocationFilterComponent";
import LanguageFilterComponent from "../filterComponents/LanguageFilterComponent";
import ElementFilterComponent from "../filterComponents/ElementFilterComponent";
import MultiSelectFilterComponent from "../filterComponents/MultiSelectFilterComponent";
import DivinityNbComponent from "../filterComponents/DivinityNbFilterComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
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

interface FilterComponentProps {
	locationOptions: OptionType[];
	elementOptions: OptionType[];
	sourceTypeOptions: OptionType[];
	agentActivityOptions: OptionType[];
	agentNameOptions: OptionType[];
}

/**
 * Affiche les filtres de la carte
 * @param {Object} props
 * @param {OptionType[]} props.locationOptions - Liste des options pour le filtre de la localisation
 * @param {OptionType[]} props.elementOptions - Liste des éléments pour le filtre des épithètes
 * @param {OptionType[]} props.sourceTypeOptions - Liste des types de source pour le filtre des épithètes
 * @param {OptionType[]} props.agentActivityOptions - Liste des activités des agents pour le filtre des activités
 * @returns LocationFilterComponent | ElementFilterComponent | LanguageFilterComponent
 */
const FilterComponent = ({
	locationOptions,
	elementOptions,
	sourceTypeOptions,
	agentActivityOptions,
	agentNameOptions,
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
		setSourceTypeNames,
		setAgentActivityNames,
		resetLanguageValues,
	} = useMapFiltersStore(useShallow((state) => state));

	// initiation d'états pour récupérer les valeurs des lieux et éléments
	const [locationNameValues, setLocationNameValues] = useState<string[]>([]);
	const [elementNameValues, setElementNameValues] = useState<string[]>([]);
	const [sourceTypeValues, setSourceTypeValues] = useState<string[]>([]);
	const [agentActivityValues, setAgentActivityValues] = useState<string[]>([]);

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
		setSourceTypeNames(sourceTypeValues);
		setAgentActivityNames(agentActivityValues);
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
		setSourceTypeValues([]);
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
									<MultiSelectFilterComponent
										key={filter.id}
										optionsArray={sourceTypeOptions}
										setValues={setSourceTypeValues}
										userFilterId="sourceTypeId"
										placeholder={
											translation[language].mapPage.aside.searchForSourceType
										}
									/>
								</div>
							);
						}
						if (filter.filter.type === "agentActivity") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>{translation[language].mapPage.aside.agentActivity}</h4>
									<MultiSelectFilterComponent
										key={filter.id}
										optionsArray={agentActivityOptions}
										setValues={setAgentActivityValues}
										userFilterId="agentActivityId"
										placeholder={
											translation[language].mapPage.aside.searchForAgentActivity
										}
									/>
								</div>
							);
						}
						if (filter.filter.type === "agentName") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>{translation[language].mapPage.aside.agentName}</h4>
									<MultiSelectFilterComponent
										key={filter.id}
										optionsArray={agentNameOptions}
										setValues={setAgentActivityValues}
										userFilterId="agentNameId"
										placeholder={
											translation[language].mapPage.aside.searchForAgentName
										}
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
				<ButtonComponent
					type="button"
					color="brown"
					textContent={translation[language].button.filter}
					onClickFunction={handleFilterButton}
				/>
				<ButtonComponent
					type="button"
					color="brown"
					textContent={translation[language].button.resetFilter}
					onClickFunction={resetFilters}
					isSelected={false}
				/>
			</div>
		</div>
	);
};

export default FilterComponent;
