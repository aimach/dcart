// import des bibliothèques
import { Marker, Tooltip } from "react-leaflet";
// import des services
import {
	isSelectedMarker,
	zoomOnMarkerOnClick,
} from "../../../../utils/functions/map";
import { getIcon } from "../../../../utils/functions/icons";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
import type { LatLngExpression, Map as LeafletMap } from "leaflet";
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./markerComponent.module.scss";

interface MarkerComponentProps {
	point: PointType;
	setPanelDisplayed?: Dispatch<SetStateAction<boolean>>;
	duplicatesCoordinates: string[];
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
	duplicatesCoordinates,
}: MarkerComponentProps) => {
	// récupération des données des stores
	const { selectedMarker, setSelectedMarker, map, mapInfos, allLayers } =
		useMapStore(
			useShallow((state) => ({
				selectedMarker: state.selectedMarker,
				setSelectedMarker: state.setSelectedMarker,
				map: state.map,
				mapInfos: state.mapInfos,
				allLayers: state.allLayers,
			})),
		);
	const setSelectedTabMenu = useMapAsideMenuStore(
		(state) => state.setSelectedTabMenu,
	);

	let position: LatLngExpression = [point.latitude, point.longitude];
	const keyPoint = `${point.latitude}-${point.longitude}`;
	if (duplicatesCoordinates.includes(keyPoint)) {
		const layerIndex = allLayers.findIndex(
			(layer) => layer === point.layerName,
		);
		position = [point.latitude, point.longitude + 0.012 * layerIndex];
	}

	// fonction pour gérer le clic sur un marker par l'utilisateur
	const handleMarkerOnClick = (map: LeafletMap, point: PointType) => {
		// ouverture de l'onglet "infos"
		setSelectedTabMenu("infos");
		setPanelDisplayed?.(true);
		// zoom sur le marker
		zoomOnMarkerOnClick(map as LeafletMap, point as PointType);
		setSelectedMarker(point);
	};

	const customIcon = getIcon(
		point,
		style,
		selectedMarker ? isSelectedMarker(selectedMarker, point) : false,
		mapInfos?.isNbDisplayed as boolean,
	);

	return (
		<Marker
			key={keyPoint}
			position={position}
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
