// import des bibliothèques
import { Marker, Tooltip } from "react-leaflet";
// import des services
import {
	getBackGroundColorClassName,
	isSelectedMarker,
	zoomOnMarkerOnClick,
} from "../../../../utils/functions/map";
import { getIcon } from "../../../../utils/functions/icons";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
import type { Map as LeafletMap } from "leaflet";
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./markerComponent.module.scss";

interface MarkerComponentProps {
	point: PointType;
	setPanelDisplayed?: Dispatch<SetStateAction<boolean>>;
}

/**
 * Composant marker de la carte
 * @param {Object} props - Les propriétés du composant
 * @param {PointType} props.point - Le point à afficher
 * @param {Function} props.setPanelDisplayed - La fonction pour afficher le panel
 * @returns
 */
const MarkerComponent = ({
	point,
	setPanelDisplayed,
}: MarkerComponentProps) => {
	// récupération des données des stores
	const { selectedMarker, setSelectedMarker, map } = useMapStore(
		useShallow((state) => ({
			selectedMarker: state.selectedMarker,
			setSelectedMarker: state.setSelectedMarker,
			map: state.map,
		})),
	);
	const setSelectedTabMenu = useMapAsideMenuStore(
		(state) => state.setSelectedTabMenu,
	);

	// création d'une clé pour chaque point (pas besoin de la mémoiser car les points ne changent pas)
	const keyPoint = `${point.latitude}-${point.longitude}`;

	// génération d'un nom de classe à partir du nombre de sources
	let backgroundColorClassName = null;
	if (selectedMarker && isSelectedMarker(selectedMarker, point)) {
		backgroundColorClassName = "selectedBackgroundColor";
	} else {
		backgroundColorClassName = getBackGroundColorClassName(
			point.sources.length,
		);
	}

	// génération d'une icone adaptée au nombre de sources (pas besoin de mémoiser car peu complexe)
	const customIcon = getIcon(
		point.sources.length,
		style,
		backgroundColorClassName,
		point.sources.length.toString(),
		point.color as string,
	);

	// fonction pour gérer le clic sur un marker par l'utilisateur
	const handleMarkerOnClick = (map: LeafletMap, point: PointType) => {
		// ouverture de l'onglet "infos"
		setSelectedTabMenu("infos");
		setPanelDisplayed?.(true);
		// zoom sur le marker
		zoomOnMarkerOnClick(map as LeafletMap, point as PointType);
		setSelectedMarker(point);
	};

	return (
		<Marker
			key={keyPoint}
			position={[point.latitude, point.longitude]}
			icon={customIcon}
			eventHandlers={{
				click: () => handleMarkerOnClick(map as LeafletMap, point),
			}}
		>
			<Tooltip direction="top" offset={[0, -10]}>
				{point.nom_ville}
			</Tooltip>
		</Marker>
	);
};

export default MarkerComponent;
