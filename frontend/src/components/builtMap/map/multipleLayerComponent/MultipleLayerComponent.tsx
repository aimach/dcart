// import des bibliothèques
import { useEffect, useMemo, useRef } from "react";
import { LayerGroup, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
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
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
import type L from "leaflet";
// import du style
import "../simpleLayerComponent/simpleLayerChoice.css";

type MultipleLayerComponentProps = {
	allMemoizedPoints: PointType[];
};

const MultipleLayerComponent = ({
	allMemoizedPoints,
}: MultipleLayerComponentProps) => {
	const { language } = useTranslation();

	const { mapInfos, allLayers, map, selectedMarker, setSelectedMarker } =
		useMapStore();
	const { setSelectedTabMenu, setIsPanelDisplayed } = useMapAsideMenuStore();

	const layersArrayForControl = useMemo(() => {
		const layersArray: {
			name_fr: string;
			name_en: string;
			shape: string | null;
			color: string | null;
			position: number;
		}[] = [];

		allMemoizedPoints.map((result: PointType) => {
			if (
				!layersArray.some(
					(layer) =>
						layer[`name_${language}`] === result[`layerName${language}`],
				)
			) {
				layersArray.push({
					name_fr: result.layerNamefr as string,
					name_en: result.layerNameen as string,
					shape: result.shape ?? null,
					color: result.color ?? null,
					position: result.position,
				});
			}
		});
		return layersArray
			.sort((a, b) => a.position - b.position)
			.map((layer) => {
				return {
					...layer,
					shapeCode: getShapeForLayerName(
						layer.shape as string,
						layer.color as string,
					),
				};
			});
	}, [allMemoizedPoints, language]);

	const allResultsWithLayerFilter = useMemo(() => {
		const allLayersWithOnlySVG = allLayers.filter((layerName) =>
			layerName?.includes("svg"),
		);

		return allMemoizedPoints.filter((point) => {
			if (
				allLayersWithOnlySVG.some(
					(layerName) =>
						layerName.replace(/<svg[\s\S]*?<\/svg>/, "").trim() ===
						point.layerNamefr,
				)
			) {
				return point;
			}
		});
	}, [allLayers, allMemoizedPoints, language]);

	const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies:<
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
				allResultsWithLayerFilter,
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
		<LayersControl position="bottomright" collapsed={false}>
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
					<LayersControl.Overlay
						name={`${layer.shapeCode} ${layer[`name_${language}`]}`}
						key={layer[`name_${language}`]}
						checked
					>
						<LayerGroup key={layer[`name_${language}`]} />
					</LayersControl.Overlay>
				);
			})}
		</LayersControl>
	);
};

export default MultipleLayerComponent;
