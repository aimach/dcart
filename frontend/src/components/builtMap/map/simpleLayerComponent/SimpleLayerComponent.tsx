// import des bibliothèques
import { useMemo } from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des services
import { getBlendIcon } from "../../../../utils/functions/icons";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
// import du style
import "./simpleLayerChoice.css";

type SimpleLayerComponentProps = {
	allMemoizedPoints: PointType[];
};

const SimpleLayerComponent = ({
	allMemoizedPoints,
}: SimpleLayerComponentProps) => {
	const { mapInfos } = useMapStore();
	const createClusterCustomIcon = (cluster) => {
		const markers = cluster.getAllChildMarkers();

		const blendIcon = getBlendIcon(markers);
		return L.divIcon({
			html: `<div class="marker-cluster-custom">${blendIcon}</div>`,
			className: "",
			iconSize: L.point(32, 32, true),
		});
	};

	// si c'est la carte 'exploration', ne pas utiliser le clustering
	return mapInfos ? (
		<MarkerClusterGroup
			spiderfyOnMaxZoom={true}
			spiderfyOnEveryZoom={true}
			showCoverageOnHover={false}
			disableClusteringAtZoom={12}
			maxClusterRadius={1}
			iconCreateFunction={createClusterCustomIcon}
		>
			{allMemoizedPoints.map((point: PointType) => (
				<MarkerComponent
					key={point.key}
					point={point}
					duplicatesCoordinates={[]}
				/>
			))}
		</MarkerClusterGroup>
	) : (
		<>
			{allMemoizedPoints.map((point: PointType) => (
				<MarkerComponent
					key={point.key}
					point={point}
					duplicatesCoordinates={[]}
				/>
			))}
		</>
	);
};

export default SimpleLayerComponent;
