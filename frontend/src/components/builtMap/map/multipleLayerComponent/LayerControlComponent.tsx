// import des bibliothèques
import { LayersControl, LayerGroup } from "react-leaflet";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des services
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";

type LayerControlComponentProps = {
	layer: { name: string; attestations: PointType[] };
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
};

const LayerControlComponent = ({
	layer,
	setPanelDisplayed,
}: LayerControlComponentProps) => {
	return (
		<LayersControl.Overlay name={layer.name} key={layer.name} checked>
			<LayerGroup key={layer.name}>
				{layer.attestations.map((point) => {
					return (
						<MarkerComponent
							key={point.key}
							point={point}
							setPanelDisplayed={setPanelDisplayed}
						/>
					);
				})}
			</LayerGroup>
		</LayersControl.Overlay>
	);
};

export default LayerControlComponent;
