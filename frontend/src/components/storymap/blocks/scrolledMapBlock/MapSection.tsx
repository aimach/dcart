// import des bibliothèques
import { useEffect, useState } from "react";
import {
	MapContainer,
	TileLayer,
	ScaleControl,
	Marker,
	Popup,
} from "react-leaflet";
// import des services
import {
	getLittleCircleIcon,
	getIcon,
} from "../../../../utils/functions/icons";
import { getAllPointsByBlockId } from "../../../../utils/api/builtMap/getRequests";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { PointType } from "../../../../utils/types/mapTypes";
// import du style
import "leaflet/dist/leaflet.css";
import style from "./scrolledMapBlock.module.scss";
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";

interface MapSectionProps {
	blockContent: BlockContentType;
	mapName: string;
	currentPoint: string | number;
	setCurrentPoint: Dispatch<SetStateAction<string>>;
	pointIndex: number;
}

const MapSection = ({
	blockContent,
	mapName,
	currentPoint,
	setCurrentPoint,
	pointIndex,
}: MapSectionProps) => {
	const mapCenter: LatLngTuple = [40.43, 16.52];

	const { isMobile, isDesktop } = useWindowSize();

	// on récupère les informations du context
	const [map, setMap] = useState<LeafletMap | null>(null);

	const [points, setPoints] = useState<(PointType & { blockId: string })[]>([]);

	const fetchPointsAndAddBlockId = async (childId: string) => {
		// récupération de tous les points
		const allAttestations = await getAllPointsByBlockId(childId);
		for (const attestation of allAttestations) {
			attestation.blockId = childId;
		}
		return allAttestations;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const loadAllPoints = async () => {
			const promesses = blockContent.children.map((child: BlockContentType) => {
				return fetchPointsAndAddBlockId(child.id);
			});
			const allAttestations = await Promise.all(promesses);
			const allPoints = allAttestations.flat();
			setPoints(allPoints);
		};
		loadAllPoints();
	}, []);

	// on met à jour les limites de la carte
	const bounds: LatLngTuple[] = [];
	useEffect(() => {
		if (points.length) {
			for (const point of points) {
				bounds.push([point.latitude, point.longitude]);
			}
			if (map) {
				map.fitBounds(bounds, { padding: isDesktop ? [300, 300] : [0, 0] });
			}
		}
	}, [map, points, isMobile]);

	const littleIcon = getLittleCircleIcon(style);

	// Fonction pour scroller au click sur le marker
	const scrollToStep = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<div id={mapName} className={style.mapSection}>
			<MapContainer
				center={mapCenter}
				scrollWheelZoom={false}
				minZoom={4}
				maxZoom={11}
				zoomControl={!isMobile}
				ref={setMap}
				style={{
					height: "100dvh",
					width: isMobile ? "90vwh" : "70vw",
					zIndex: 0,
				}}
			>
				<>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png"
					/>

					{points.length ? (
						points.map((point: PointType & { blockId: string }) => {
							const bigIcon = getIcon(
								point,
								style,
								false,
								false,
								pointIndex.toString(),
							);

							return (
								<Marker
									key={`${point.latitude} - ${point.longitude} + ${point.blockId}`}
									position={[point.latitude, point.longitude]}
									icon={currentPoint === point.blockId ? bigIcon : littleIcon}
									eventHandlers={{
										click: () => {
											setCurrentPoint(point.blockId as string);
											scrollToStep(point.blockId as string);
										},
									}}
								>
									<Popup>{point.nom_ville}</Popup>
								</Marker>
							);
						})
					) : (
						<div>Aucun résultat</div>
					)}
					<ScaleControl position="bottomright" />
					{/* {isMobile && <ZoomControl position="bottomleft" />} */}
				</>
			</MapContainer>
		</div>
	);
};

export default MapSection;
