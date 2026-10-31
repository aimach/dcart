// import des bibliothèques
import { useEffect, useMemo, useRef, useState } from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { LayerGroup, LayersControl } from "react-leaflet";
// import des composants
import LayersControlToggle from "../../../common/mapLegend/LayersControlToggle";
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
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
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
// import des types
import type L from "leaflet";
import type {
	MapColorType,
	MapIconType,
	PointType,
} from "../../../../utils/types/mapTypes";
// import du style
import "./simpleLayerChoice.css";

type SimpleLayerComponentProps = {
	allMemoizedPoints: PointType[];
};

const SimpleLayerComponent = ({
	allMemoizedPoints,
}: SimpleLayerComponentProps) => {
	const { language } = useTranslation();

	const { map, mapInfos, selectedMarker, setSelectedMarker, hasGrayScale } =
		useMapStore();
	const { setSelectedTabMenu, setIsPanelDisplayed } = useMapAsideMenuStore();

	const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
	// control de calques utilisé comme légende, pour y ajouter le bouton ouvrir/fermer
	const [layersControl, setLayersControl] =
		useState<L.Control.Layers | null>(null);

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
			return mapInfos?.attestations
				.map((attestation) => {
					return {
						name_fr: attestation.name_fr,
						name_en: attestation.name_en,
						color: (attestation.color as MapColorType).code_hex,
						shape: (attestation.icon as MapIconType).name_en,
						position: attestation.position,
					};
				})
				.sort((a, b) => a.position - b.position);
		}
		return [];
	}, [mapInfos]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: variable 'language' sinon ré-affiche les checkboxes à chaque changement de langue
	useEffect(() => {
		if (allColorsAndShapes.length > 0) {
			const inputs = document.querySelectorAll(
				".leaflet-control-layers-selector",
			);
			for (const input of inputs) {
				(input as HTMLElement).style.display = "none";
			}
		}
	}, [allColorsAndShapes, language, hasGrayScale]);

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
				key={hasGrayScale.toString()}
			>
				{allMemoizedPoints.map((point: PointType) => (
					<MarkerComponent
						key={point.key}
						point={point}
						{...{ hasGrayScale }}
					/>
				))}
			</MarkerClusterGroup>
			{allColorsAndShapes.length > 0 && (
				<LayersControl
					position="bottomright"
					collapsed={false}
					ref={setLayersControl}
				>
					{allColorsAndShapes.map((layer) => {
						const icon =
							getShapeForLayerName(layer.shape, layer.color, hasGrayScale) +
							layer[`name_${language}`];
						return (
							<LayersControl.Overlay name={icon} key={icon}>
								<LayerGroup key={icon} />
							</LayersControl.Overlay>
						);
					})}
				</LayersControl>
			)}
			{allColorsAndShapes.length > 0 && (
				<LayersControlToggle control={layersControl} />
			)}
		</>
	) : (
		<>
			{allMemoizedPoints.map((point: PointType) => (
				<MarkerComponent key={point.key} point={point} {...{ hasGrayScale }} />
			))}
		</>
	);
};

export default SimpleLayerComponent;
