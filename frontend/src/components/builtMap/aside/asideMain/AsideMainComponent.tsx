import { useState, useEffect, useMemo, useRef } from "react";
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
	fetchElementOptions,
	getMinAndMaxElementNumbers,
} from "../../../../utils/functions/filter";
import {
	getAgentActivityOptions,
	getAgentivityOptions,
	getAgentStatusOptions,
	getGenderOptions,
	getLocationOptions,
	getSourceMaterialOptions,
	getSourceTypeOptions,
} from "./AsideMainComponentUtils";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
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

	// --- RECUPERATION DES OPTIONS DES TYPES DE SOURCE POUR LES FILTRES
	let sourceTypeOptions: OptionType[] = [];
	sourceTypeOptions = useMemo(
		() => getSourceTypeOptions(mapInfos, allPoints, language),
		[mapInfos, allPoints, language],
	);

	// --- RECUPERATION DES OPTIONS DE LOCALISATION POUR LES FILTRES
	let locationOptions: OptionType[] = [];
	// si le filtre de localisation est activé, utilisation du hook useMemo
	locationOptions = useMemo(
		() => getLocationOptions(mapInfos, allPoints, language),
		[mapInfos, allPoints, language],
	);

	// --- RECUPERATION DES OPTIONS D'ELEMENTS POUR LES FILTRES
	const [elementOptions, setElementOptions] = useState<OptionType[]>([]);
	const formatElementOptions = async () => {
		const newElementOptions = await fetchElementOptions(
			allPoints,
			language,
			false,
		);
		setElementOptions(newElementOptions);
	};

	// --- RECUPERATION DES OPTIONS ACTIVITES D'AGENTS POUR LES FILTRES
	const agentActivityOptions = useMemo(
		() => getAgentActivityOptions(mapInfos, allPoints, language),
		[mapInfos, allPoints, language],
	);

	// --- RECUPERATION DES OPTIONS STATUTS D'AGENTS POUR LES FILTRES
	const agentStatusOptions = useMemo(
		() => getAgentStatusOptions(mapInfos, allPoints, language),
		[mapInfos, allPoints, language],
	);

	// --- RECUPERATION DES OPTIONS AGENTIVITÉ POUR LES FILTRES
	const agentivityOptions = useMemo(
		() => getAgentivityOptions(mapInfos, allPoints, language),
		[mapInfos, allPoints, language],
	);

	// --- RECUPERATION DES OPTIONS SUPPORTS DE SOURCE POUR LES FILTRES
	const sourceMaterialOptions = useMemo(
		() => getSourceMaterialOptions(mapInfos, allPoints, language),
		[mapInfos, allPoints, language],
	);

	// --- RECUPERATION DES OPTIONS GENRE DE L'AGENT POUR LES FILTRES
	const agentGenderOptions = useMemo(
		() => getGenderOptions(mapInfos, allPoints),
		[mapInfos, allPoints],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (mapInfos && allPoints) {
			// si le filtre des éléments est activé, on récupère les options
			if (
				mapInfos.filterMapContent?.some(
					(filter) => filter.filter.type === "element",
				)
			) {
				formatElementOptions();
			}
		}
	}, [mapInfos, allPoints]);

	// calcul des bornes temporelles pour le filtre de temps (évite de les recalculer à chaque re-render)
	const timeBoundsRef = useRef(null as { min: number; max: number } | null);
	useEffect(() => {
		if (!mapInfos || !allPoints) return;
		if (allPoints.length > 0 && !timeBoundsRef.current) {
			const { min, max } = getMinAndMaxElementNumbers(allPoints);
			timeBoundsRef.current = { min, max };
		}
	}, [allPoints, mapInfos]);

	// définition du composant à rendre
	switch (selectedTabMenu) {
		case "results":
			return <ResultComponent />;
		case "filters":
			return (
				<FilterComponent
					locationOptions={locationOptions}
					elementOptions={elementOptions}
					sourceTypeOptions={sourceTypeOptions}
					agentActivityOptions={agentActivityOptions}
					agentStatusOptions={agentStatusOptions}
					agentivityOptions={agentivityOptions}
					sourceMaterialOptions={sourceMaterialOptions}
					agentGenderOptions={agentGenderOptions}
					timeBoundsRef={timeBoundsRef}
				/>
			);
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
