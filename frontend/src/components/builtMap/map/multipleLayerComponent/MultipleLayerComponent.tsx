// import des bibliothèques
import { useEffect, useMemo, useRef } from "react";
import { LayerGroup, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L, { LatLngExpression } from "leaflet";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import {
	getBlendIcon,
	getShapeForLayerName,
} from "../../../../utils/functions/icons";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
// import du style
import "../simpleLayerComponent/simpleLayerChoice.css";

type MultipleLayerComponentProps = {
	allMemoizedPoints: PointType[];
};

const MultipleLayerComponent = ({
	allMemoizedPoints,
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

	const createClusterCustomIcon = (cluster) => {
		const markers = cluster.getAllChildMarkers();

		const blendIcon = getBlendIcon(markers);
		return L.divIcon({
			html: `<div class="marker-cluster-custom">${blendIcon}</div>`,
			className: "",
			iconSize: L.point(32, 32, true),
		});
	};

	const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

	useEffect(() => {
		if (!map) return;

		if (selectedMarker) {
			const tooltip = L.tooltip({
				direction: "top",
				offset: L.point(10, -20),
				permanent: false,
			})
				.setLatLng([selectedMarker.latitude, selectedMarker.longitude])
				.setContent(selectedMarker.nom_ville)
				.addTo(map);
			map.flyTo([selectedMarker.latitude, selectedMarker.longitude], 11, {
				animate: false,
			});

			// fermer le tooltip après 2s
			setTimeout(() => map.closeTooltip(tooltip), 2000);
		}

		const handleClusterClick = (e) => {
			const cluster = e.layer;
			const clusterPosition = cluster.getLatLng();
			const point = allResultsWithLayerFilter.find(
				(point) =>
					point.latitude === clusterPosition.lat &&
					point.longitude === clusterPosition.lng,
			);
			const tooltipContent = point
				? point.nom_ville
				: selectedMarker?.nom_ville;

			cluster
				.bindTooltip(tooltipContent, {
					permanent: false,
					direction: "top",
					offset: L.point(10, -20),
				})
				.openTooltip();
			if (map.getZoom() > 8) {
				cluster.spiderfy();
			}
		};

		const clusterGroup = clusterRef.current;
		if (!clusterGroup) return;
		clusterGroup.on("clustermouseover", handleClusterClick);
		clusterGroup.on("clusterclick", (e) => {
			map.flyTo([point?.latitude as number, point?.longitude as number], 11, {
				animate: false,
			});
		});

		return () => {
			clusterGroup.off("clustermouseover", handleClusterClick);
		};
	}, [map, selectedMarker, allResultsWithLayerFilter]);

	return (
		<LayersControl position="bottomright">
			<MarkerClusterGroup
				ref={clusterRef}
				spiderfyOnMaxZoom={true}
				spiderfyOnEveryZoom={true}
				showCoverageOnHover={false}
				zoomToBoundsOnClick={false}
				disableClusteringAtZoom={12}
				maxClusterRadius={1}
				iconCreateFunction={createClusterCustomIcon}
			>
				{allResultsWithLayerFilter.map((point, index) => {
					const pointKey = `${point.latitude}-${point.longitude}-${index}`;
					return (
						<MarkerComponent
							key={pointKey}
							point={point}
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
