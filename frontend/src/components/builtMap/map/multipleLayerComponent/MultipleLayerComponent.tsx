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
import { getShapeForLayerName } from "../../../../utils/functions/icons";

type MultipleLayerComponentProps = {
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
};

const MultipleLayerComponent = ({
	setPanelDisplayed,
}: MultipleLayerComponentProps) => {
	const { allResults } = useMapStore();

	const duplicatesCoordinates = useMemo(() => {
		const pointsKeys = allResults.map(
			(result) => `${result.latitude}-${result.longitude}`,
		);
		return pointsKeys.filter(
			(item, index) => pointsKeys.indexOf(item) !== index,
		);
	}, [allResults]);

	const layersWithAttestationsArray = useMemo(() => {
		const layersArray: {
			name: string;
			attestations: PointType[];
			shape: string | null;
			color: string | null;
		}[] = [];

		allResults.map((result: PointType) => {
			if (!layersArray.some((layer) => layer.name === result.layerName)) {
				layersArray.push({
					name: result.layerName as string,
					attestations: [result],
					shape: result.shape ?? null,
					color: result.color ?? null,
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
		return layersArray.map((layer) => {
			return {
				...layer,
				name: getShapeForLayerName(layer.shape, layer.name, layer.color),
			};
		});
	}, [allResults]);

	return (
		<LayersControl position="bottomright">
			{layersWithAttestationsArray.map((layer) => {
				return (
					<LayerControlComponent
						key={layer.name}
						layer={layer}
						setPanelDisplayed={setPanelDisplayed}
						duplicatesCoordinates={duplicatesCoordinates}
					/>
				);
			})}
		</LayersControl>
	);
};

export default MultipleLayerComponent;
