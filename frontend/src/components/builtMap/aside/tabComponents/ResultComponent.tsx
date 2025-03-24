// import des bibliothèques
import { useCallback, useMemo } from "react";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import {
	isSelectedMarker,
	zoomOnMarkerOnClick,
} from "../../../../utils/functions/map";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
import type { Map as LeafletMap } from "leaflet";
// import du style
import style from "./tabComponent.module.scss";
// import des icônes
import { MapPin } from "lucide-react";

/**
 * Affiche une liste des points affichés sur la carte (filtrés ou non)
 */
const ResultComponent = () => {
	// récupération des données de traduction
	const { language } = useTranslation();

	// récupération des données des stores
	const { map, allResults, allLayers, selectedMarker, setSelectedMarker } =
		useMapStore(
			useShallow((state) => ({
				map: state.map,
				allResults: state.allResults,
				allLayers: state.allLayers,
				selectedMarker: state.selectedMarker,
				setSelectedMarker: state.setSelectedMarker,
			})),
		);
	const { setSelectedTabMenu } = useMapAsideMenuStore(
		useShallow((state) => ({
			setSelectedTabMenu: state.setSelectedTabMenu,
		})),
	);

	// fonction pour gérer le clic sur un point (zoom et passage à l'onglet "sélection")
	const handleResultClick = useCallback(
		(result: PointType) => {
			setSelectedMarker(result);
			setSelectedTabMenu("infos");
			zoomOnMarkerOnClick(map as LeafletMap, result as PointType);
		},
		[map, setSelectedMarker, setSelectedTabMenu],
	);

	// fonction de calcul de la classe CSS pour chaque point (sélectionné ou non)
	const resultsWithSelectedPoint = useMemo(() => {
		return allResults
			.map((point: PointType) => {
				const isSelected = isSelectedMarker(selectedMarker as PointType, point);
				return {
					...point,
					isSelected,
					selectedClassName: isSelected ? style.isSelected : undefined,
				};
			})
			.filter((point: PointType) =>
				allLayers.includes(point.layerName as string),
			);
	}, [allResults, selectedMarker, allLayers]);

	return (
		<div className={style.resultContainer}>
			{resultsWithSelectedPoint.map((result: PointType) => {
				return (
					<div
						key={`${result.latitude}-${result.longitude}`}
						onClick={() => handleResultClick(result)}
						onKeyUp={() => handleResultClick(result)}
						className={`${style.resultDetails} ${result.selectedClassName}`}
					>
						<MapPin />
						<p>
							{result.nom_ville} ({result[`sous_region_${language}`]}) -{" "}
							{result.sources.length}{" "}
							{result.sources.length > 1 ? "sources" : "source"}
						</p>
					</div>
				);
			})}
		</div>
	);
};

export default ResultComponent;
