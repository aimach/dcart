// import des bibliothèques
import { useMemo } from "react";
import { LayerGroup, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { PointType } from "../../../../utils/types/mapTypes";
import {
	getBlendIcon,
	getShapeForLayerName,
} from "../../../../utils/functions/icons";
// import du style
import "../simpleLayerComponent/simpleLayerChoice.css";

type MultipleLayerComponentProps = {
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
};

const MultipleLayerComponent = ({
	setPanelDisplayed,
}: MultipleLayerComponentProps) => {
	const { allResults, allLayers } = useMapStore();

	const duplicatesCoordinates = useMemo(() => {
		const pointsKeys = allResults.map(
			(result, index) => `${result.latitude}-${result.longitude}-${index}`,
		);
		return pointsKeys.filter(
			(item, index) => pointsKeys.indexOf(item) !== index,
		);
	}, [allResults]);

	const layersWithAttestationsArray = useMemo(() => {
		const layersArray: {
			name: string;
			shape: string | null;
			color: string | null;
		}[] = [];

		allResults.map((result: PointType) => {
			if (!layersArray.some((layer) => layer.name === result.layerName)) {
				layersArray.push({
					name: result.layerName as string,
					shape: result.shape ?? null,
					color: result.color ?? null,
				});
			}
		});
		return layersArray.map((layer) => {
			return {
				...layer,
				name: getShapeForLayerName(layer.shape, layer.name, layer.color),
			};
		});
	}, [allResults]);

	const allResultsWithLayerFilter = useMemo(() => {
		return allResults.filter((point) => {
			if (
				allLayers.some((string) => string.includes(`svg> ${point.layerName}`))
			)
				return point;
		});
	}, [allLayers, allResults]);

	const allPointColorsAndShapes = useMemo(() => {
		const seenShapeAndColor = new Set();
		const uniqueShapeAndColor = [];
		for (const point of allResultsWithLayerFilter) {
			const shapeAndColor = `${point.shape}-${point.color}`;
			if (!seenShapeAndColor.has(shapeAndColor)) {
				seenShapeAndColor.add(shapeAndColor);
				uniqueShapeAndColor.push(shapeAndColor);
			}
		}
		return uniqueShapeAndColor;
	}, [allResultsWithLayerFilter]);

	const createClusterCustomIcon = () => {
		const blendIcon = getBlendIcon(allPointColorsAndShapes);
		return L.divIcon({
			html: `<div class="marker-cluster-custom">${blendIcon}</div>`,
			className: "",
			iconSize: L.point(32, 32, true),
		});
	};

	return (
		<LayersControl position="bottomright">
			<MarkerClusterGroup
				spiderfyOnMaxZoom={true}
				spiderfyOnEveryZoom={true}
				showCoverageOnHover={false}
				disableClusteringAtZoom={12}
				maxClusterRadius={1}
				iconCreateFunction={createClusterCustomIcon}
			>
				{allResultsWithLayerFilter.map((point) => {
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
			{layersWithAttestationsArray.map((layer) => {
				return (
					<LayersControl.Overlay name={layer.name} key={layer.name} checked>
						<LayerGroup key={layer.name} />
					</LayersControl.Overlay>
				);
			})}
		</LayersControl>
	);
};

export default MultipleLayerComponent;
