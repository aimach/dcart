// import des bibliothèques
import { useMemo } from "react";
import { LayersControl } from "react-leaflet";
// import des composants
import LayerControlComponent from "./LayerControlComponent";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { PointType } from "../../../../utils/types/mapTypes";

type MultipleLayerComponentProps = {
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
};

const MultipleLayerComponent = ({
	setPanelDisplayed,
}: MultipleLayerComponentProps) => {
	const { allResults } = useMapStore();

	const layersWithAttestationsArray = useMemo(() => {
		const layersArray: { name: string; attestations: PointType[] }[] = [];
		allResults.map((result: PointType) => {
			if (!layersArray.some((layer) => layer.name === result.layerName)) {
				layersArray.push({
					name: result.layerName as string,
					attestations: [result],
				});
			} else {
				const layer = layersArray.find(
					(layer) => layer.name === result.layerName,
				);
				if (layer) {
					layer.attestations.push(result);
				}
			}
		});
		return layersArray;
	}, [allResults]);

	return (
		<LayersControl position="bottomright">
			{layersWithAttestationsArray.map((layer) => {
				return (
					<LayerControlComponent
						key={layer.name}
						layer={layer}
						setPanelDisplayed={setPanelDisplayed}
					/>
				);
			})}
		</LayersControl>
	);
};

export default MultipleLayerComponent;
