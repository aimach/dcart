import { useState, useEffect, useContext } from "react";
// import des composants
import ResultComponent from "../tabComponents/ResultComponent";
import FilterComponent from "../tabComponents/FilterComponent";
import InfoComponent from "../tabComponents/InfoComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
import {
	getLocationOptions,
	getAllDivinities,
} from "../../../utils/loaders/loaders";
import {
	getAllElementsFromPoints,
	getLocationURL,
} from "../../../utils/functions/functions";
// import des types
import type {
	PointType,
	GreatRegionType,
	DivinityType,
} from "../../../utils/types/mapTypes";
// import du style
import style from "./asideMainComponent.module.scss";

interface AsideMainComponentProps {
	results: PointType[];
	mapId: string;
}

type OptionType = { value: number; label: string };

const AsideMainComponent = ({ results, mapId }: AsideMainComponentProps) => {
	// on récupère les données de la langue
	const { translation, language } = useContext(TranslationContext);

	// on récupère l'onglet en cours
	const selectedTabMenu = useMapAsideMenuStore(
		(state) => state.selectedTabMenu,
	);

	// on récupère le point en cours
	const { mapInfos, allPoints, selectedMarker } = useMapStore((state) => state);

	// RECUPERATION DES OPTIONS DE LOCALISATION POUR LES FILTRES
	// on va chercher les options du filtre de localisation
	const [locationOptions, setLocationOptions] = useState<OptionType[]>([]);
	const [locationLevel, setLocationLevel] = useState<string>("");

	const fetchLocationOptions = async (routeSegment: string) => {
		try {
			const allLocationOptions = await getLocationOptions(routeSegment);
			const formatedLocationOptions: OptionType[] = allLocationOptions.map(
				(option: GreatRegionType) => ({
					value: option.id,
					label: option[`nom_${language}`],
				}),
			);
			setLocationOptions(formatedLocationOptions);
		} catch (error) {
			console.error("Erreur lors du chargement des localités:", error);
		}
	};

	// RECUPERATION DES OPTIONS D'ELEMENTS POUR LES FILTRES
	// on va chercher les options du filtre d'éléments
	const [elementOptions, setElementOptions] = useState<OptionType[]>([]);

	const fetchElementOptions = async () => {
		try {
			// on récupère toutes les divinités
			const allDivinities = await getAllDivinities();
			// à partir des formules, on récupère tous les éléments
			const allElements = await getAllElementsFromPoints(allPoints);
			// on récupère les éléments qui ne sont pas des théonymes
			const elementsWithoutTheonyms = allElements.filter((element) => {
				return !allDivinities.some(
					(divinity: DivinityType) => divinity.id === element.element_id,
				);
			});
			// enfin, on formatte les options pour le select
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
			setElementOptions(formatedElementOptions);
		} catch (error) {
			console.error("Erreur lors du chargement des localités:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (mapInfos) {
			const locationURL = getLocationURL(mapInfos, setLocationLevel);
			fetchLocationOptions(locationURL);
			fetchElementOptions();
		}
	}, [mapInfos]);

	// on définit le composant à rendre
	switch (selectedTabMenu) {
		case "results":
			return <ResultComponent results={results} />;
		case "filters":
			return (
				<FilterComponent
					locationOptions={locationOptions}
					locationLevel={locationLevel}
					elementOptions={elementOptions}
				/>
			);
		case "infos":
			return selectedMarker ? (
				<div className={style.infoContainer}>
					<InfoComponent
						point={selectedMarker as PointType}
						isSelected={true}
						mapId={mapId}
					/>
				</div>
			) : (
				<p>{translation[language].mapPage.aside.noSelectedMarker}</p>
			);
		default:
			return <ResultComponent results={results} />;
	}
};

export default AsideMainComponent;
