// import des bibliothèques
import { useCallback, useEffect, useMemo, useState } from "react";
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
// import des services
import {
	createClusterCustomIcon,
	getShapeForLayerName,
} from "../../../../utils/functions/icons";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
import { getAllPointsByBlockId } from "../../../../utils/api/builtMap/getRequests";
// import des types
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { PointType } from "../../../../utils/types/mapTypes";
// import du style
import "leaflet/dist/leaflet.css";
import style from "./simpleMapBlock.module.scss";
import "./simpleMapBlock.css";

interface SimpleMapBlockProps {
	blockContent: BlockContentType;
	mapName: string;
}

const SimpleMapBlock = ({ blockContent, mapName }: SimpleMapBlockProps) => {
	const mapCenter: LatLngTuple = [40.43, 16.52];

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
		map.fitBounds(bounds);
	}, [points, map]);

	// récupérer les formes et les couleurs des attestations
	const allColorsAndShapes = useMemo(() => {
		return (blockContent.attestations ?? []).map(({ name, color, icon }) => ({
			name,
			color: color?.code_hex,
			shape: icon?.name_en,
		}));
	}, [blockContent.attestations]);

	useEffect(() => {
		const inputs = document.querySelectorAll(
			".leaflet-control-layers-selector",
		);
		for (const input of inputs) {
			(input as HTMLInputElement).style.display = "none";
		}
	}, [points]);

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
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url={blockContent[`content2_${selectedLanguage}`]}
						/>
						<MarkerClusterGroup
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
											key={`${point.latitude}-${point.longitude}`}
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
										getShapeForLayerName(layer.shape, layer.color) + layer.name;
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
