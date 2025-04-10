import { useState, useEffect, useMemo } from "react";
// import des composants
import ResultComponent from "../tabComponents/ResultComponent";
import FilterComponent from "../tabComponents/FilterComponent";
import InfoComponent from "../tabComponents/InfoComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { getAllDivinities } from "../../../../utils/api/builtMap/getRequests";
import {
	fetchElementOptions,
	getAllElementsFromPoints,
	getAllLocationsFromPoints,
} from "../../../../utils/functions/filter";
// import des types
import type { DivinityType } from "../../../../utils/types/mapTypes";
import type { OptionType } from "../../../../utils/types/commonTypes";
import type { FilterType } from "../../../../utils/types/filterTypes";
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

	// --- RECUPERATION DES OPTIONS DE LOCALISATION POUR LES FILTRES
	let locationOptions: OptionType[] = [];
	// si le filtre de localisation est activé, utilisation du hook useMemo



	locationOptions = useMemo(() => {
		if (
			(mapInfos?.filterMapContent)?.some(
				(filter) => filter.filter.type === "location",
			)
		) {
			// récupération de toutes les localités depuis la liste des points
			const allLocationsFromPoints: Record<string, string>[] =
				getAllLocationsFromPoints(allPoints);

			// récupération de la clé du champ en fonction du niveau de localisation (grande région / sous région)
			const fieldKeyFromLocationLevel = "sous_region";

			// formattage des options pour le select
			return allLocationsFromPoints
				.map((option) => ({
					value: option[`${fieldKeyFromLocationLevel}_id`],
					label: option[`${fieldKeyFromLocationLevel}_${language}`],
				}))
				.sort((option1, option2) =>
					option1.label < option2.label
						? -1
						: option1.label > option2.label
							? 1
							: 0,
				);
		}
		return [];
	}, [allPoints, language, mapInfos]);

	// --- RECUPERATION DES OPTIONS D'ELEMENTS POUR LES FILTRES
	const [elementOptions, setElementOptions] = useState<OptionType[]>([]);
	const formatElementOptions = async () => {
		const newElementOptions = await fetchElementOptions(allPoints, language, true);
		setElementOptions(newElementOptions);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (mapInfos && allPoints) {
			// si le filtre des éléments est activé, on récupère les options
			if (
				(mapInfos.filterMapContent as FilterType[])?.some(
					(filter) => filter.filter.type === "element",
				)
			) {
				formatElementOptions();
			}
		}
	}, [mapInfos, allPoints]);

	// définition du composant à rendre
	switch (selectedTabMenu) {
		case "results":
			return <ResultComponent />;
		case "filters":
			return (
				<FilterComponent
					locationOptions={locationOptions}
					elementOptions={elementOptions}
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
