// import des bibliothèques
import { Marker, Tooltip } from "react-leaflet";
import { useLocation } from "react-router";
// import des services
import { isSelectedMarker } from "../../../../utils/functions/map";
import { getIcon } from "../../../../utils/functions/icons";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
import type { LatLngExpression } from "leaflet";
// import du style
import style from "./markerComponent.module.scss";

interface MarkerComponentProps {
	point: PointType;
}

/**
 * Composant marker de la carte
 * @param {Object} props - Les propriétés du composant
 * @param {PointType} props.point - Le point à afficher
 * @returns
 */
const MarkerComponent = ({ point }: MarkerComponentProps) => {
	const location = useLocation();
	const itemType =
		location.pathname.split("/")[2] === "maps" ? "maps" : "storymap";

	// récupération des données des stores
	const { selectedMarker, setSelectedMarker, mapInfos } = useMapStore(
		useShallow((state) => state),
	);
	const { setSelectedTabMenu, setIsPanelDisplayed } = useMapAsideMenuStore();

	const position: LatLngExpression = [point.latitude, point.longitude];
	const keyPoint = `${point.latitude}-${point.longitude}`;

	// fonction pour gérer le clic sur un marker par l'utilisateur
	const handleMarkerOnClick = (point: PointType) => {
		if (itemType === "maps") {
			// ouverture de l'onglet "infos"
			setSelectedTabMenu("infos");
			setIsPanelDisplayed?.(true);

			setSelectedMarker(point);
		}
	};

	const customIcon = getIcon(
		point,
		style,
		selectedMarker ? isSelectedMarker(selectedMarker, point) : false,
		mapInfos ? (mapInfos.isNbDisplayed as boolean) : true,
	);

	return (
		<Marker
			key={keyPoint}
			position={position}
			icon={customIcon}
			{...{ colorAndShape: { color: point.color, shape: point.shape } }}
			eventHandlers={{
				click: () => handleMarkerOnClick(point),
			}}
		>
			<Tooltip direction="top" offset={[0, -10]}>
				{point.nom_ville}
			</Tooltip>
		</Marker>
	);
};

export default MarkerComponent;
