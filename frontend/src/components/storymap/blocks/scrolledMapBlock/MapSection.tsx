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
	getIcon,
	getBackGroundColorClassName,
	getLittleCircleIcon,
} from "../../../../utils/functions/icons";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import type {
	BlockContentType,
	GroupedTyped,
} from "../../../../utils/types/storymapTypes";
// import du style
import "leaflet/dist/leaflet.css";
import style from "./scrolledMapBlock.module.scss";

interface MapSectionProps {
	blockContent: BlockContentType;
	mapName: string;
	currentPoint: string | number;
	setCurrentPoint: Dispatch<SetStateAction<string>>;
}

const MapSection = ({
	blockContent,
	mapName,
	currentPoint,
	setCurrentPoint,
}: MapSectionProps) => {
	const mapCenter: LatLngTuple = [40.43, 16.52];

	// on récupère les informations du context
	const [map, setMap] = useState<LeafletMap | null>(null);

	const points: GroupedTyped[] = [];

	// on construit le groupe des points à partir des enfants
	blockContent.children.map((child: BlockContentType) => {
		(child.groupedPoints as GroupedTyped[]).map((point) =>
			points.push({ ...point, blockId: child.id }),
		);
	});

	// on met à jour les limites de la carte
	const bounds: LatLngTuple[] = [];
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (points.length) {
			for (const point of points) {
				bounds.push([point.latitude, point.longitude]);
			}
			if (map) {
				map.fitBounds(bounds);
			}
		}
	}, [map, points]);

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
				ref={setMap}
				style={{ height: "100vh", width: "70vw" }}
			>
				<>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png"
					/>

					{points.length ? (
						points.map((point: GroupedTyped) => {
							// on créé une icone adaptée au nombre de sources
							const backgroundColorClassName =
								point.color ??
								getBackGroundColorClassName(point.attestations.length);
							const bigIcon = getIcon(
								point.attestations.length,
								style,
								backgroundColorClassName,
								point.attestations.length.toString(),
							);
							return (
								<Marker
									key={`${point.latitude} - ${point.longitude}`}
									position={[point.latitude, point.longitude]}
									icon={currentPoint === point.blockId ? bigIcon : littleIcon}
									eventHandlers={{
										click: () => {
											setCurrentPoint(point.blockId as string);
											scrollToStep(point.blockId as string);
										},
									}}
								>
									<Popup>{point.attestations[0].location}</Popup>
								</Marker>
							);
						})
					) : (
						<div>Aucun résultat</div>
					)}
					<ScaleControl position="bottomright" />
				</>
			</MapContainer>
		</div>
	);
};

export default MapSection;
