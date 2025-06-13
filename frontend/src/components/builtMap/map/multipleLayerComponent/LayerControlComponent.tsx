// import des bibliothèques
import { LayersControl, LayerGroup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
// import du style
// @ts-ignore: pas de déclaration de type
import "react-leaflet-markercluster/styles";

type LayerControlComponentProps = {
	layer: { name: string; attestations: PointType[] };
};

const LayerControlComponent = ({ layer }: LayerControlComponentProps) => {
	const { language } = useTranslation();

	return (
		<LayersControl.Overlay
			name={layer[`name_${language}` as keyof typeof layer] as string}
			key={layer[`name_${language}` as keyof typeof layer] as string}
			checked
		>
			<LayerGroup
				key={layer[`name_${language}` as keyof typeof layer] as string}
			>
				<MarkerClusterGroup
					spiderfyOnMaxZoom={true}
					spiderfyOnEveryZoom={true}
					showCoverageOnHover={false}
					disableClusteringAtZoom={12}
					maxClusterRadius={1}
				>
					{layer.attestations.map((point) => {
						const pointKey = `${point.latitude}-${point.longitude}`;
						return <MarkerComponent key={pointKey} point={point} />;
					})}
				</MarkerClusterGroup>
			</LayerGroup>
		</LayersControl.Overlay>
	);
};

export default LayerControlComponent;
