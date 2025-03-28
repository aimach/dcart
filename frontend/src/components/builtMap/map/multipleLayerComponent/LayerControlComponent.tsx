// import des bibliothèques
import { LayersControl, LayerGroup, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";
// import du style
import "react-leaflet-markercluster/styles";

type LayerControlComponentProps = {
	layer: { name: string; attestations: PointType[] };
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
	duplicatesCoordinates: string[];
};

const LayerControlComponent = ({
	layer,
	setPanelDisplayed,
	duplicatesCoordinates,
}: LayerControlComponentProps) => {
	const points = [
		{ id: 1, label: "Point A", lat: 48.8566, lng: 2.3522 },
		{ id: 2, label: "Point B", lat: 48.8566, lng: 2.3522 },
		{ id: 3, label: "Point C", lat: 48.8566, lng: 2.3522 },
	];

	return (
		<LayersControl.Overlay name={layer.name} key={layer.name} checked>
			<LayerGroup key={layer.name}>
				<MarkerClusterGroup
					spiderfyOnMaxZoom={true}
					spiderfyOnEveryZoom={true}
					showCoverageOnHover={false}
					disableClusteringAtZoom={18}
					maxClusterRadius={40}
				>
					{layer.attestations.map((point) => {
						const pointKey = `${point.latitude}-${point.longitude}`;
						return (
							<MarkerComponent
								key={pointKey}
								point={point}
								setPanelDisplayed={setPanelDisplayed}
								duplicatesCoordinates={duplicatesCoordinates}
							/>
						);
					})}
				</MarkerClusterGroup>
			</LayerGroup>
		</LayersControl.Overlay>
	);
};

export default LayerControlComponent;
