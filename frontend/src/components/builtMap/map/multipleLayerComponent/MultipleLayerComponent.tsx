// import des bibliothèques
import { useEffect, useMemo, useRef } from "react";
import { LayerGroup, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import {
	getBlendIcon,
	getShapeForLayerName,
} from "../../../../utils/functions/icons";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { PointType } from "../../../../utils/types/mapTypes";
// import du style
import "../simpleLayerComponent/simpleLayerChoice.css";

type MultipleLayerComponentProps = {
	allMemoizedPoints: PointType[];
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
};

const MultipleLayerComponent = ({
	allMemoizedPoints,
	setPanelDisplayed,
}: MultipleLayerComponentProps) => {
	const { allLayers, map, selectedMarker } = useMapStore();

	const duplicatesCoordinatesArray = allMemoizedPoints
		.map((result, index) => `${result.latitude}-${result.longitude}-${index}`)
		.filter((item, index, array) => array.indexOf(item) !== index);

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

	const createClusterCustomIcon = (allPointColorsAndShapes: string[]) => {
		const blendIcon = getBlendIcon(allPointColorsAndShapes);
		return L.divIcon({
			html: `<div class="marker-cluster-custom">${blendIcon}</div>`,
			className: "",
			iconSize: L.point(32, 32, true),
		});
	};

	const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

	useEffect(() => {
		if (!map) return;
		const clusterGroup = clusterRef.current;
		if (!clusterGroup) return;

		const handleClusterClick = (e) => {
			const cluster = e.layer;
			const clusterPosition = cluster.getLatLng();
			const pointPosition = allResultsWithLayerFilter.find(
				(point) =>
					point.latitude === clusterPosition.lat &&
					point.longitude === clusterPosition.lng,
			);
			const tooltipContent = pointPosition
				? pointPosition.nom_ville
				: selectedMarker?.nom_ville;

			cluster
				.bindTooltip(tooltipContent, {
					permanent: false,
					direction: "top",
					offset: L.point(10, -20),
				})
				.openTooltip();
		};

		clusterGroup.on("clustermouseover", handleClusterClick);

		if (selectedMarker) {
			L.tooltip({
				direction: "top",
				offset: L.point(10, -20),
			})
				.setLatLng([selectedMarker.latitude, selectedMarker.longitude])
				.setContent(selectedMarker.nom_ville)
				.addTo(map);
		}

		return () => {
			clusterGroup.off("clustermouseover", handleClusterClick);
		};
	}, [map, selectedMarker, clusterRef, allResultsWithLayerFilter]);

	return (
		<LayersControl position="bottomright">
			<MarkerClusterGroup
				key={JSON.stringify(allPointColorsAndShapes)} // permet de forcer le re-render pour iconCreateFunction (sinon allPointColorsAndShapes est vide)
				ref={clusterRef}
				spiderfyOnMaxZoom={true}
				spiderfyOnEveryZoom={true}
				showCoverageOnHover={false}
				disableClusteringAtZoom={12}
				maxClusterRadius={1}
				iconCreateFunction={() =>
					createClusterCustomIcon(allPointColorsAndShapes)
				}
			>
				{allResultsWithLayerFilter.map((point) => {
					const pointKey = `${point.latitude}-${point.longitude}`;
					return (
						<MarkerComponent
							key={pointKey}
							point={point}
							setPanelDisplayed={setPanelDisplayed}
							duplicatesCoordinates={duplicatesCoordinatesArray}
						/>
					);
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
