// import des bibliothèques
import { useContext } from "react";
import { Marker, Tooltip } from "react-leaflet";
// import du context
import { MapContext } from "../../../context/MapContext";
import { MapAsideMenuContext } from "../../../context/MapAsideMenuContext";
// import des services
import {
	getBackGroundColorClassName,
	isSelectedMarker,
} from "../../../utils/functions/functions";
import { zoomOnMarkerOnClick } from "../../../utils/functions/functions";
import { getIcon } from "../icons";
// import des types
import type { PointType } from "../../../types/mapTypes";
import type { Map as LeafletMap } from "leaflet";
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./markerComponent.module.scss";

interface MarkerComponentProps {
	point: PointType;
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
}

const MarkerComponent = ({
	point,
	setPanelDisplayed,
}: MarkerComponentProps) => {
	// on récupère le context (point sélectionné, map)
	const { selectedMarker, setSelectedMarker, map } = useContext(MapContext);

	// on récupère l'onglet en cours dans le panel
	const { setSelectedTabMenu } = useContext(MapAsideMenuContext);

	// on créé une clé pour chaque point
	const keyPoint = `${point.latitude}-${point.longitude}`;

	// on génère un nom de classe à partir du nombre de sources
	let backgroundColorClassName = null;
	if (selectedMarker && isSelectedMarker(selectedMarker, point)) {
		backgroundColorClassName = "selectedBackgroundColor";
	} else {
		backgroundColorClassName = getBackGroundColorClassName(
			point.sources.length,
		);
	}

	// on créé une icone adaptée au nombre de sources
	const icon = getIcon(
		point.sources.length,
		style,
		backgroundColorClassName,
		point.sources.length.toString(),
	);

	const handleMarkerOnClick = (map: LeafletMap, point: PointType) => {
		// on passe dans l'onglet "infos"
		setSelectedTabMenu("infos");
		setPanelDisplayed(true);
		// on zoom sur le marker
		zoomOnMarkerOnClick(map as LeafletMap, point as PointType);
		setSelectedMarker(point);
	};

	return (
		<Marker
			key={keyPoint}
			position={[point.latitude, point.longitude]}
			icon={icon}
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
