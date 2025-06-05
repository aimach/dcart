// import des bibliothèques
import { useEffect, useMemo, useRef } from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des services
import {
	createClusterCustomIcon,
	getShapeForLayerName,
} from "../../../../utils/functions/icons";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import {
	handleClusterClick,
	handleClusterMouseOver,
	handleSpiderfyPosition,
	zoomOnSelectedMarkerCluster,
} from "../../../../utils/functions/map";
// import des types
import type L from "leaflet";
import type {
	MapColorType,
	MapIconType,
	PointType,
} from "../../../../utils/types/mapTypes";
// import du style
import "./simpleLayerChoice.css";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { LayerGroup, LayersControl } from "react-leaflet";

type SimpleLayerComponentProps = {
	allMemoizedPoints: PointType[];
};

const SimpleLayerComponent = ({
	allMemoizedPoints,
}: SimpleLayerComponentProps) => {
	const { map, mapInfos, selectedMarker, setSelectedMarker } = useMapStore();
	const { setSelectedTabMenu, setIsPanelDisplayed } = useMapAsideMenuStore();

	const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (!map) return;

		const clusterGroup = clusterRef.current;
		if (!clusterGroup) return;

		clusterGroup.on("clustermouseover", (e) => handleClusterMouseOver(e));
		clusterGroup.on("clusterclick", (e) =>
			handleClusterClick(
				e,
				map,
				setSelectedMarker,
				allMemoizedPoints,
				setSelectedTabMenu,
				setIsPanelDisplayed,
			),
		);

		return () => {
			clusterGroup.off("clustermouseover", (e) => handleClusterMouseOver(e));
			clusterGroup.off("clusterclick", (e) =>
				handleClusterClick(
					e,
					map,
					setSelectedMarker,
					allMemoizedPoints,
					setSelectedTabMenu,
					setIsPanelDisplayed,
				),
			);
		};
	}, [map, allMemoizedPoints, clusterRef]);

	useEffect(() => {
		if (!map) return;
		if (selectedMarker) {
			zoomOnSelectedMarkerCluster(map, selectedMarker, mapInfos);
		}
	}, [map, selectedMarker, mapInfos]);

	// récupérer les formes et les couleurs des attestations
	const allColorsAndShapes = useMemo(() => {
		if (mapInfos) {
			return mapInfos?.attestations.map((attestation) => {
				return {
					name: attestation.name,
					color: (attestation.color as MapColorType).code_hex,
					shape: (attestation.icon as MapIconType).name_en,
				};
			});
		}
		return [];
	}, [mapInfos]);

	useEffect(() => {
		if (allColorsAndShapes.length > 0) {
			const inputs = document.querySelectorAll(
				".leaflet-control-layers-selector",
			);
			for (const input of inputs) {
				input.style.display = "none";
			}
		}
	}, [allColorsAndShapes]);

	// si c'est la carte 'exploration', ne pas utiliser le clustering
	return mapInfos ? (
		<>
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
				{allMemoizedPoints.map((point: PointType) => (
					<MarkerComponent key={point.key} point={point} />
				))}
			</MarkerClusterGroup>
			{allColorsAndShapes.length > 0 && (
				<LayersControl position="bottomright" collapsed={false}>
					{allColorsAndShapes.map((layer) => {
						const icon =
							getShapeForLayerName(layer.shape, layer.color) + layer.name;
						return (
							<LayersControl.Overlay name={icon} key={icon}>
								<LayerGroup key={icon} />
							</LayersControl.Overlay>
						);
					})}
				</LayersControl>
			)}
		</>
	) : (
		<>
			{allMemoizedPoints.map((point: PointType) => (
				<MarkerComponent key={point.key} point={point} />
			))}
		</>
	);
};

export default SimpleLayerComponent;
