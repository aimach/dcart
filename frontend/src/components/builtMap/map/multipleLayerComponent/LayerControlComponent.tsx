// import des bibliothèques
import { LayersControl, LayerGroup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";
// import du style
// @ts-ignore: pas de déclaration de type
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
	const { language } = useTranslation();

	return (
		<LayersControl.Overlay
			name={layer[`name_${language}`]}
			key={layer[`name_${language}`]}
			checked
		>
			<LayerGroup key={layer[`name_${language}`]}>
				<MarkerClusterGroup
					spiderfyOnMaxZoom={true}
					spiderfyOnEveryZoom={true}
					showCoverageOnHover={false}
					disableClusteringAtZoom={12}
					maxClusterRadius={1}
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
