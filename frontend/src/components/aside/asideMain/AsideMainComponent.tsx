import { useState, useEffect, useMemo } from "react";
// import des composants
import ResultComponent from "../tabComponents/ResultComponent";
import FilterComponent from "../tabComponents/FilterComponent";
import InfoComponent from "../tabComponents/InfoComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
import { getAllDivinities } from "../../../utils/api/getRequests";
import {
	getAllElementsFromPoints,
	getAllLocationsFromPoints,
} from "../../../utils/functions/filter";
// import des types
import type { DivinityType } from "../../../utils/types/mapTypes";
import type { OptionType } from "../../../utils/types/commonTypes";
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
	if (mapInfos?.filters?.some((filter) => filter.type === "location")) {
		locationOptions = useMemo(() => {
			// récupération de toutes les localités depuis la liste des points
			const allLocationsFromPoints: { [key: string]: string }[] =
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
		}, [allPoints, language]);
	}

	// --- RECUPERATION DES OPTIONS D'ELEMENTS POUR LES FILTRES
	const [elementOptions, setElementOptions] = useState<OptionType[]>([]);
	// pas d'utilisation de useMemo car requête asynchrone
	const fetchElementOptions = async () => {
		// récupération des divinités de la BDD MAP
		const allDivinities = await getAllDivinities();

		// extraction des éléments depuis les formules des points
		const allElements = getAllElementsFromPoints(allPoints);

		// filtrage des éléments qui ne sont pas des théonymes
		const elementsWithoutTheonyms = allElements.filter((element) => {
			return !allDivinities.some(
				(divinity: DivinityType) => divinity.id === element.element_id,
			);
		});

		// formattage des options pour le select
		const formatedElementOptions: OptionType[] = elementsWithoutTheonyms
			.map((option) => ({
				value: option.element_id,
				label: option[`element_nom_${language}`],
			}))
			.sort((option1, option2) =>
				option1.label < option2.label
					? -1
					: option1.label > option2.label
						? 1
						: 0,
			);

		// mise à jour des options
		setElementOptions(formatedElementOptions);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (mapInfos && allPoints) {
			// si le filtre des éléments est activé, on récupère les options
			if (mapInfos.filters?.some((filter) => filter.type === "element")) {
				fetchElementOptions();
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
