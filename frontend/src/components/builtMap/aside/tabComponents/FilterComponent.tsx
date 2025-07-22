// import des bibliothèques
import { useCallback } from "react";
// import des composants
import LocationFilterComponent from "../filterComponents/LocationFilterComponent";
import LanguageFilterComponent from "../filterComponents/LanguageFilterComponent";
import ElementFilterComponent from "../filterComponents/ElementFilterComponent";
import MultiSelectFilterComponent from "../filterComponents/MultiSelectFilterComponent";
import DivinityNbComponent from "../filterComponents/DivinityNbFilterComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
import AgentGenderFilterComponent from "../filterComponents/AgentGenderFilterComponent";
import TimeFilterComponent from "../filterComponents/TimeFilterComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";
// import des services
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { getAllPointsByMapId } from "../../../../utils/api/builtMap/getRequests";
import { useShallow } from "zustand/shallow";
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";
import { singleSelectInLineStyle } from "../../../../styles/inLineStyle";
import { useMapFilterReminderStore } from "../../../../utils/stores/builtMap/mapFilterReminderStore";
// import du style
import style from "./tabComponent.module.scss";

/**
 * Affiche les filtres de la carte

 * @returns LocationFilterComponent | ElementFilterComponent | LanguageFilterComponent
 */
const FilterComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	const { isMobile } = useWindowSize();

	// récupération des données depuis les stores
	const { mapInfos, setAllPoints, setAllResults, setMapReady, setAllLayers } =
		useMapStore(useShallow((state) => state));
	const { mapFilters, setIsPanelDisplayed } = useMapAsideMenuStore();
	const { userFilters, resetUserFilters, isReset, setIsReset } =
		useMapFiltersStore(useShallow((state) => state));
	const {
		resetTemporaryReminderValues,
		locationNameValues,
		elementNameValues,
		elementNbValues,
		sourceTypeValues,
		agentActivityValues,
		agentStatusValues,
		agentivityValues,
		sourceMaterialValues,
		setSourceTypeValues,
		setAgentActivityValues,
		setAgentStatusValues,
		setAgentivityValues,
		setSourceMaterialValues,
		setElementNbValues,
		resetFilterReminders,
		setLocationFilterReminders,
		setElementFilterReminders,
		setElementNbFilterReminders,
		setLanguageFilterReminders,
		setSourceTypeFilterReminders,
		setAgentActivityFilterReminders,
		setAgentStatusFilterReminders,
		setAgentivityFilterReminders,
		setSourceMaterialFilterReminders,
		setGenderFilterReminders,
	} = useMapFilterReminderStore();
	const {
		hasFilteredPoints,
		setHasFilteredPoints,
		initialSourceTypeOptions,
		initialAgentActivityOptions,
		initialAgentStatusOptions,
		initialAgentivityOptions,
		initialSourceMaterialOptions,
		filteredSourceTypeOptions,
		filteredAgentActivityOptions,
		filteredAgentStatusOptions,
		filteredAgentivityOptions,
		filteredSourceMaterialOptions,
		resetFilteredOptions,
		resetInitialOptions,
	} = useMapFilterOptionsStore();

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
		setHasFilteredPoints(true);
		setLocationFilterReminders(locationNameValues);
		setElementFilterReminders(elementNameValues);
		const sourceTypeWithoutCategory = sourceTypeValues.map(
			(sourceTypeValue) => sourceTypeValue.split(">")[1],
		);
		setElementNbFilterReminders(elementNbValues);
		setSourceTypeFilterReminders(sourceTypeWithoutCategory);
		setAgentActivityFilterReminders(agentActivityValues);
		setAgentStatusFilterReminders(agentStatusValues);
		setAgentivityFilterReminders(agentivityValues);
		const sourceMaterialValuesWithoutCategory = sourceMaterialValues.map(
			(sourceMaterialValue) => sourceMaterialValue.split(">")[1],
		);
		setSourceMaterialFilterReminders(sourceMaterialValuesWithoutCategory);
		setLanguageFilterReminders({
			greek: userFilters.greek,
			semitic: userFilters.semitic,
		});
		setGenderFilterReminders(
			userFilters.agentGender as Record<string, boolean>,
		);
		isMobile && setIsPanelDisplayed(false);
	};

	// fonction pour gérer le reset des filtres
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	const resetFilters = useCallback(() => {
		resetFilteredOptions();
		resetInitialOptions();
		resetUserFilters();
		resetFilterReminders();
		resetTemporaryReminderValues();
		setIsReset(!isReset);
		// on recharge les points de la carte
		fetchAllPoints("reset");
		setAllLayers([]);
	}, [fetchAllPoints, resetUserFilters, setIsReset]);

	const filterTitlePrefix = `${translation[language].common.filter} : `;

	return (
		<div className={style.resultContainer}>
			<div>
				{mapInfos && (
					<p>{translation[language].mapPage.aside.filterIntroduction}</p>
				)}
				{isMobile && <TimeFilterComponent disabled={false} />}
				{mapFilters.length > 0 &&
					mapFilters.map((filter) => {
						if (filter.filter.type === "location") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>
										{filterTitlePrefix}
										{translation[language].mapPage.aside.location}
									</h4>
									<LocationFilterComponent key={filter.id} />
								</div>
							);
						}
						if (filter.filter.type === "element") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>
										{filterTitlePrefix}
										{translation[language].mapPage.aside.element}
									</h4>
									<ElementFilterComponent key={filter.id} />
								</div>
							);
						}
						if (filter.filter.type === "divinityNb") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>
										{filterTitlePrefix}
										{translation[language].mapPage.aside.divinityNb}
									</h4>
									<DivinityNbComponent
										key={filter.id}
										setElementNbValues={setElementNbValues}
									/>
								</div>
							);
						}
						if (filter.filter.type === "language") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>
										{filterTitlePrefix}
										{translation[language].mapPage.aside.language}
									</h4>
									<LanguageFilterComponent key={filter.id} />
								</div>
							);
						}
						if (filter.filter.type === "sourceType") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>
										{filterTitlePrefix}
										{translation[language].mapPage.aside.sourceType}
									</h4>
									<MultiSelectFilterComponent
										styles={singleSelectInLineStyle}
										key={filter.id}
										optionsArray={
											hasFilteredPoints
												? filteredSourceTypeOptions
												: initialSourceTypeOptions
										}
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
									<h4>
										{filterTitlePrefix}
										{translation[language].mapPage.aside.agentActivity}
									</h4>
									<MultiSelectFilterComponent
										styles={singleSelectInLineStyle}
										key={filter.id}
										optionsArray={
											hasFilteredPoints
												? filteredAgentActivityOptions
												: initialAgentActivityOptions
										}
										setValues={setAgentActivityValues}
										userFilterId="agentActivityId"
										placeholder={
											translation[language].mapPage.aside.searchForAgentActivity
										}
									/>
								</div>
							);
						}
						if (filter.filter.type === "agentGender") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>
										{filterTitlePrefix}
										{translation[language].mapPage.aside.agentGender}
									</h4>
									<AgentGenderFilterComponent />
								</div>
							);
						}
						if (filter.filter.type === "agentStatus") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>
										{filterTitlePrefix}
										{translation[language].mapPage.aside.agentStatus}
									</h4>
									<MultiSelectFilterComponent
										styles={singleSelectInLineStyle}
										key={filter.id}
										optionsArray={
											hasFilteredPoints
												? filteredAgentStatusOptions
												: initialAgentStatusOptions
										}
										setValues={setAgentStatusValues}
										userFilterId="agentStatusName"
										placeholder={
											translation[language].mapPage.aside.searchForAgentivity
										}
									/>
								</div>
							);
						}
						if (filter.filter.type === "agentivity") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>
										{filterTitlePrefix}
										{translation[language].mapPage.aside.agentivity}
									</h4>
									<MultiSelectFilterComponent
										styles={singleSelectInLineStyle}
										key={filter.id}
										optionsArray={
											hasFilteredPoints
												? filteredAgentivityOptions
												: initialAgentivityOptions
										}
										setValues={setAgentivityValues}
										userFilterId="agentivityName"
										placeholder={
											translation[language].mapPage.aside.searchForAgentivity
										}
									/>
								</div>
							);
						}
						if (filter.filter.type === "sourceMaterial") {
							return (
								<div className={style.filterContainer} key={filter.id}>
									<h4>
										{filterTitlePrefix}
										{translation[language].mapPage.aside.sourceMaterial}
									</h4>
									<MultiSelectFilterComponent
										styles={singleSelectInLineStyle}
										key={filter.id}
										optionsArray={
											hasFilteredPoints
												? filteredSourceMaterialOptions
												: initialSourceMaterialOptions
										}
										setValues={setSourceMaterialValues}
										userFilterId="sourceMaterialName"
										placeholder={
											translation[language].mapPage.aside
												.searchForSourceMaterial
										}
									/>
								</div>
							);
						}
					})}
				{mapFilters.length === 0 && (
					<>
						<div className={style.filterContainer}>
							<h4>
								{filterTitlePrefix}
								{translation[language].mapPage.aside.language}
							</h4>
							<LanguageFilterComponent />
						</div>
						<div className={style.filterContainer}>
							<h4>
								{filterTitlePrefix}
								{translation[language].mapPage.aside.location}
							</h4>
							<LocationFilterComponent />
						</div>
						<div className={style.filterContainer}>
							<h4>
								{filterTitlePrefix}
								{translation[language].mapPage.aside.element}
							</h4>
							<ElementFilterComponent />
						</div>
					</>
				)}
			</div>
			<div className={style.filterButtonContainer}>
				<ButtonComponent
					type="button"
					color="blue"
					textContent={translation[language].button.filter}
					onClickFunction={handleFilterButton}
				/>
				<ButtonComponent
					type="button"
					color="brown"
					textContent={translation[language].button.resetFilter}
					onClickFunction={resetFilters}
				/>
			</div>
		</div>
	);
};

export default FilterComponent;
