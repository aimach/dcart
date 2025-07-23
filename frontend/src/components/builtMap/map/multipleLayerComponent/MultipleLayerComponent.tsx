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
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";

type MultipleLayerComponentProps = {
	allMemoizedPoints: PointType[];
};

const MultipleLayerComponent = ({
	allMemoizedPoints,
}: MultipleLayerComponentProps) => {
	const { language } = useTranslation();
	const {
		mapInfos,
		allLayers,
		map,
		selectedMarker,
		setSelectedMarker,
		hasGrayScale,
		allResults,
		setAllResults,
	} = useMapStore();
	const { setSelectedTabMenu, setIsPanelDisplayed } = useMapAsideMenuStore();
	const { hasFilteredPoints } = useMapFilterOptionsStore();

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
				const shapeCodeWithColors = getShapeForLayerName(
					layer.shape as string,
					layer.color as string,
					false,
				);
				return {
					...layer,
					shapeCode: shapeCodeWithColors,
					shapeCodeGrayScale: getShapeForLayerName(
						layer.shape as string,
						layer.color as string,
						true,
					),
				};
			});
	}, [allMemoizedPoints, language]);

	const allResultsWithLayerFilter = useMemo(() => {
		const allLayersWithOnlySVG = allLayers.filter((layerName) =>
			layerName?.includes("svg"),
		);
		const allLayersWithoutSVGWithoutDuplicates = [
			...new Set(allLayersWithOnlySVG),
		];

		const filteredPoints = allMemoizedPoints.filter((point) => {
			const isLayerDisplayed = allLayersWithoutSVGWithoutDuplicates.some(
				(layerName) =>
					layerName.replace(/<svg[\s\S]*?<\/svg>/, "").trim() ===
						point.layerNamefr ||
					layerName.replace(/<svg[\s\S]*?<\/svg>/, "").trim() ===
						point.layerNameen,
			);
			if (isLayerDisplayed) {
				return point;
			}
		});
		return filteredPoints;
	}, [allLayers, allMemoizedPoints, language]);

	useEffect(() => {
		setAllResults(allResultsWithLayerFilter);
	}, [allResultsWithLayerFilter]);

	const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: recharger pour afficher la traduction des noms des layers
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

	// modification du name des layers sans recharger le composant
	useEffect(() => {
		const svgs = document.querySelectorAll(
			"div.leaflet-control-layers-overlays svg",
		);
		svgs.forEach((oldSVG, id) => {
			const wrapper = document.createElement("div");
			wrapper.innerHTML =
				layersArrayForControl[id][
					hasGrayScale ? "shapeCodeGrayScale" : "shapeCode"
				];
			const newSVG = wrapper.firstChild as SVGElement;
			if (newSVG) {
				oldSVG.replaceWith(newSVG);
			}
		});
	}, [hasGrayScale, layersArrayForControl]);

	const allMarkers = useMemo(() => {
		return allResultsWithLayerFilter.map((point, index) => {
			const pointKey = `${point.latitude}-${point.longitude}-${index}`;
			return <MarkerComponent key={pointKey} point={point} />;
		});
	}, [allResultsWithLayerFilter, language]);

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
				key={`${hasGrayScale.toString()}-${allResults.length}`}
			>
				{allMarkers}
			</MarkerClusterGroup>
			{layersArrayForControl.map((layer) => {
				return (
					<LayersControl.Overlay
						name={`${layer[hasGrayScale ? "shapeCodeGrayScale" : "shapeCode"]} ${layer[`name_${language}`]}`}
						key={layer[`name_${language}`]}
						checked={
							hasFilteredPoints
								? allLayers.some(
										(layerName) =>
											layerName ===
											`${layer[hasGrayScale ? "shapeCodeGrayScale" : "shapeCode"]} ${layer[`name_${language}`]}`,
									)
								: true
						}
					>
						<LayerGroup key={layer[`name_${language}`]} />
					</LayersControl.Overlay>
				);
			})}
		</LayersControl>
	);
};

export default MultipleLayerComponent;
