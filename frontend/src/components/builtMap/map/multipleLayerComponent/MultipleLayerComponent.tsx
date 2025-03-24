// import des bibliothèques
import { LayersControl } from "react-leaflet";
// import des composants
import LayerControlComponent from "./LayerControlComponent";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import des types
import type { Dispatch, SetStateAction } from "react";

type MultipleLayerComponentProps = {
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
};

const MultipleLayerComponent = ({
	setPanelDisplayed,
}: MultipleLayerComponentProps) => {
	const { mapInfos } = useMapStore();

	return (
		<LayersControl position="bottomright">
			{mapInfos?.attestations.map((attestation) => {
				return (
					<LayerControlComponent
						key={attestation.id}
						attestation={attestation}
						setPanelDisplayed={setPanelDisplayed}
					/>
				);
			})}
		</LayersControl>
	);
};

export default MultipleLayerComponent;
