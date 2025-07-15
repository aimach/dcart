// import des bibliothèques
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	MapContainer,
	TileLayer,
	ScaleControl,
	ZoomControl,
	LayersControl,
	LayerGroup,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
// import des composants
import MarkerComponent from "../../../builtMap/map/MarkerComponent/MarkerComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import {
	createClusterCustomIcon,
	getShapeForLayerName,
} from "../../../../utils/functions/icons";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
import { getAllPointsByBlockId } from "../../../../utils/api/builtMap/getRequests";
import {
	getMapAttribution,
	handleClusterMouseOver,
} from "../../../../utils/functions/map";
// import des types
import type { L, LatLngTuple, Map as LeafletMap } from "leaflet";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type {
	MapColorType,
	MapIconType,
	PointType,
} from "../../../../utils/types/mapTypes";
// import du style
import style from "./simpleMapBlock.module.scss";
import "leaflet/dist/leaflet.css";
import "./simpleMapBlock.css";

interface SimpleMapBlockProps {
	blockContent: BlockContentType;
	mapName: string;
}

const SimpleMapBlock = ({ blockContent, mapName }: SimpleMapBlockProps) => {
	const mapCenter: LatLngTuple = [40.43, 16.52];

	const { language } = useTranslation();
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	const [map, setMap] = useState<LeafletMap | null>(null);
	const [points, setPoints] = useState<PointType[]>([]);

	const fetchAllPoints = useCallback(async () => {
		const allAttestationsPoints = await getAllPointsByBlockId(blockContent.id);
		setPoints(allAttestationsPoints);
	}, [blockContent.id]);

	useEffect(() => {
		fetchAllPoints();
	}, [fetchAllPoints]);

	// on met à jour les limites de la carte
	useEffect(() => {
		if (!map || points.length === 0) return;

		const bounds: LatLngTuple[] = points.map(({ latitude, longitude }) => [
			latitude,
			longitude,
		]);
		map.fitBounds(bounds, { padding: [50, 50] });
	}, [points, map]);

	// récupérer les formes et les couleurs des attestations
	const allColorsAndShapes = useMemo(() => {
		return (blockContent.attestations ?? []).map(
			({ name_fr, name_en, color, icon }) => ({
				name_fr,
				name_en,
				color: (color as MapColorType).code_hex,
				shape: (icon as MapIconType).name_en,
			}),
		);
	}, [blockContent.attestations]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: volontaire, sinon s'exécute trop tôt
	useEffect(() => {
		const inputs = document.querySelectorAll(
			".leaflet-control-layers-selector",
		);
		for (const input of inputs) {
			(input as HTMLInputElement).style.display = "none";
		}
	}, [points]);

	const tileAttribution = getMapAttribution(blockContent.content2_lang1);

	const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

	useEffect(() => {
		if (!map) return;

		const clusterGroup = clusterRef.current;
		if (!clusterGroup) return;

		clusterGroup.on("clustermouseover", (e: L.LeafletEvent) =>
			handleClusterMouseOver(e),
		);

		return () => {
			clusterGroup.off("clustermouseover", (e: L.LeafletEvent) =>
				handleClusterMouseOver(e),
			);
		};
	}, [map]);

	// au montage, ajout d'un label aux boutons de zoom pour l'accessibilité
	useEffect(() => {
		const zoomIn = document.querySelector(".leaflet-control-zoom-in");
		const zoomOut = document.querySelector(".leaflet-control-zoom-out");

		if (zoomIn) zoomIn.setAttribute("aria-label", "Zoomer");
		if (zoomOut) zoomOut.setAttribute("aria-label", "Dézoomer");
	}, []);

	return (
		<>
			<div id={mapName}>
				<MapContainer
					center={mapCenter}
					scrollWheelZoom={false}
					minZoom={4}
					maxZoom={11}
					zoomControl={false}
					ref={setMap}
				>
					<>
						<TileLayer
							opacity={0.6}
							attribution={`dCART | &copy; ${tileAttribution}`}
							url={blockContent.content2_lang1}
						/>
						<MarkerClusterGroup
							ref={clusterRef}
							spiderfyOnClick={false}
							spiderfyOnMaxZoom={false}
							showCoverageOnHover={false}
							zoomToBoundsOnClick={false}
							disableClusteringAtZoom={12}
							maxClusterRadius={1}
							disableSpiderfy={true}
							iconCreateFunction={createClusterCustomIcon}
						>
							{points.length > 0 ? (
								points.map((point: PointType) => {
									return (
										<MarkerComponent
											key={`${point.latitude}-${point.longitude}-${point.color}-${point.shape}`}
											point={point}
										/>
									);
								})
							) : (
								<div>Aucun résultat</div>
							)}
						</MarkerClusterGroup>
						{allColorsAndShapes.length > 0 && (
							<LayersControl position="bottomright" collapsed={false}>
								{allColorsAndShapes.map((layer) => {
									const icon =
										getShapeForLayerName(layer.shape, layer.color) +
										layer[`name_${language}`];
									return (
										<LayersControl.Overlay name={icon} key={icon}>
											<LayerGroup key={icon} />
										</LayersControl.Overlay>
									);
								})}
							</LayersControl>
						)}
						<ZoomControl position="topright" />
						<ScaleControl position="bottomright" />
					</>
				</MapContainer>
			</div>
			<h4 className={style.mapTitle}>
				{blockContent[`content1_${selectedLanguage}`]}
			</h4>
		</>
	);
};

export default SimpleMapBlock;
