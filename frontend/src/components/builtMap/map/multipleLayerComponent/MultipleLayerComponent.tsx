// import des bibliothèques
import { useEffect, useMemo, useRef } from "react";
import { LayerGroup, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import {
	createClusterCustomIcon,
	getShapeForLayerName,
} from "../../../../utils/functions/icons";
import {
	handleClusterClick,
	handleClusterMouseOver,
	handleSpiderfyPosition,
	zoomOnSelectedMarkerCluster,
} from "../../../../utils/functions/map";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
import type L from "leaflet";
// import du style
import "../simpleLayerComponent/simpleLayerChoice.css";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";

type MultipleLayerComponentProps = {
	allMemoizedPoints: PointType[];
};

const MultipleLayerComponent = ({
	allMemoizedPoints,
}: MultipleLayerComponentProps) => {
	const { mapInfos, allLayers, map, selectedMarker, setSelectedMarker } =
		useMapStore();
	const { setSelectedTabMenu, setIsPanelDisplayed } = useMapAsideMenuStore();

	const layersArrayForControl = useMemo(() => {
		const layersArray: {
			name: string;
			shape: string | null;
			color: string | null;
		}[] = [];

		allMemoizedPoints.map((result: PointType) => {
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
				name: getShapeForLayerName(
					layer.shape as string,
					layer.name,
					layer.color as string,
				),
			};
		});
	}, [allMemoizedPoints]);


	const allResultsWithLayerFilter = useMemo(() => {
		return allMemoizedPoints.filter((point) => {
			if (
				allLayers.some((string) => string.includes(`svg> ${point.layerName}`))
			)
				return point;
		});
	}, [allLayers, allMemoizedPoints]);

	const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies:<
	useEffect(() => {
		if (!map) return;

		const clusterGroup = clusterRef.current;
		if (!clusterGroup) return;

		clusterGroup.on("clustermouseover", (e) =>
			handleClusterMouseOver(e, selectedMarker, allResultsWithLayerFilter),
		);
		clusterGroup.on("clusterclick", (e) =>
			handleClusterClick(
				e,
				map,
				setSelectedMarker,
				allResultsWithLayerFilter,
				setSelectedTabMenu,
				setIsPanelDisplayed,
			),
		);

		return () => {
			clusterGroup.off("clustermouseover", (e) =>
				handleClusterMouseOver(e, selectedMarker, allResultsWithLayerFilter),
			);
			clusterGroup.off("clusterclick", (e) =>
				handleClusterClick(
					e,
					map,
					setSelectedMarker,
					allResultsWithLayerFilter,
					setSelectedTabMenu,
					setIsPanelDisplayed,
				),
			);
		};
	}, [map, allResultsWithLayerFilter]);

	useEffect(() => {
		if (!map) return;
		if (selectedMarker) {
			zoomOnSelectedMarkerCluster(map, selectedMarker, mapInfos);
		}
	}, [map, selectedMarker, mapInfos]);

	return (
		<LayersControl position="bottomright">
			<MarkerClusterGroup
				ref={clusterRef}
				zoomToBoundsOnClick={false}
				spiderfyOnMaxZoom={true}
				removeOutsideVisibleBounds={false}
				spiderfyOnEveryZoom={true}
				showCoverageOnHover={false}
				disableClusteringAtZoom={12}
				maxClusterRadius={1}
				iconCreateFunction={createClusterCustomIcon}
				spiderfyShapePositions={handleSpiderfyPosition}
			>
				{allResultsWithLayerFilter.map((point, index) => {
					const pointKey = `${point.latitude}-${point.longitude}-${index}`;
					return <MarkerComponent key={pointKey} point={point} />;
				})}
			</MarkerClusterGroup>
			{layersArrayForControl.map((layer) => {
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
