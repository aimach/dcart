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
import { getLocationOptions } from "../../../utils/loaders/loaders";
import { getLocationURL } from "../../../utils/functions/functions";
// import des types
import type { PointType, GreatRegionType } from "../../../utils/types/mapTypes";

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
	const { mapInfos, selectedMarker } = useMapStore((state) => state);

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

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (mapInfos) {
			const locationURL = getLocationURL(mapInfos, setLocationLevel);
			fetchLocationOptions(locationURL);
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
