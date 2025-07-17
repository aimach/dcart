import { useEffect } from "react";
// import des composants
import ResultComponent from "../tabComponents/ResultComponent";
import FilterComponent from "../tabComponents/FilterComponent";
import InfoComponent from "../tabComponents/InfoComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import {
	getElementOptions,
	getMinAndMaxElementNumbers,
} from "../../../../utils/functions/filter";
import {
	getAgentActivityOptions,
	getAgentGenderOptions,
	getAgentivityOptions,
	getAgentStatusOptions,
	getLanguageOptions,
	getLocationOptions,
	getSourceMaterialOptions,
	getSourceTypeOptions,
} from "./AsideMainComponentUtils";
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";
// import du style
import style from "./asideMainComponent.module.scss";

/**
 * Affiche le corps du panel latéral en fonction de l'onglet sélectionné
 * @returns ResultComponent | FilterComponent | InfoComponent
 */
const AsideMainComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const selectedTabMenu = useMapAsideMenuStore(
		(state) => state.selectedTabMenu,
	);
	const { mapInfos, allPoints, selectedMarker } = useMapStore((state) => state);
	const { resetInitialOptions } = useMapFilterOptionsStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		resetInitialOptions();
	}, [mapInfos?.id]);

	useEffect(() => {
		const getAllOptionsForFilters = async () => {
			getSourceTypeOptions(mapInfos, allPoints, language);
			await getLocationOptions(mapInfos, allPoints, language);
			getElementOptions(mapInfos, allPoints, language, false);
			getAgentActivityOptions(mapInfos, allPoints, language);
			getAgentStatusOptions(mapInfos, allPoints, language);
			getAgentivityOptions(mapInfos, allPoints, language);
			getSourceMaterialOptions(mapInfos, allPoints, language);
			getAgentGenderOptions(mapInfos, allPoints);
			getMinAndMaxElementNumbers(mapInfos, allPoints);
			getLanguageOptions(mapInfos, allPoints);
		};
		getAllOptionsForFilters();
	}, [mapInfos, allPoints, language]);

	// définition du composant à rendre
	switch (selectedTabMenu) {
		case "results":
			return <ResultComponent />;
		case "filters":
			return <FilterComponent />;
		case "infos":
			return selectedMarker ? (
				<div className={style.infoContainer}>
					<InfoComponent />
				</div>
			) : (
				<p>{translation[language].mapPage.aside.noSelectedMarker}</p>
			);
		default:
			return <ResultComponent />;
	}
};

export default AsideMainComponent;
