// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import {
	MapContainer,
	TileLayer,
	ScaleControl,
	ZoomControl,
	Marker,
	Popup,
} from "react-leaflet";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import {
	getIcon,
	getBackGroundColorClassName,
} from "../../../../utils/functions/icons";
// import des types
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import type {
	BlockContentType,
	GroupedTyped,
} from "../../../../utils/types/storymapTypes";
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

	// on récupère les informations du context
	const { language } = useTranslation();
	const [map, setMap] = useState<LeafletMap | null>(null);

	const points = blockContent.groupedPoints as GroupedTyped[];

	// on met à jour les limites de la carte
	const bounds: LatLngTuple[] = [];
	useEffect(() => {
		if (points.length) {
			for (const point of points) {
				bounds.push([point.latitude, point.longitude]);
			}
			if (map) {
				map.fitBounds(bounds);
			}
		}
	}, [points, map]);

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
							url={blockContent.content2_fr}
						/>

						{points.length ? (
							points.map((point: GroupedTyped) => {
								// on créé une icone adaptée au nombre de sources
								const backgroundColorClassName =
									point.color ??
									getBackGroundColorClassName(point.attestations.length);
								const icon = getIcon(
									point.attestations.length,
									style,
									backgroundColorClassName,
									point.attestations.length.toString(),
								);
								return (
									<Marker
										key={`${point.latitude}-${point.longitude}`}
										position={[point.latitude, point.longitude]}
										icon={icon}
									>
										<Popup>
											{point.attestations.map((attestation, index: number) => {
												return (
													// biome-ignore lint/suspicious/noArrayIndexKey: no other choice
													<p key={index}>
														{attestation.extraction} -{" "}
														{attestation.translation_fr}
													</p>
												);
											})}
										</Popup>
									</Marker>
								);
							})
						) : (
							<div>Aucun résultat</div>
						)}
						<ZoomControl position="topright" />
						<ScaleControl position="bottomright" />
					</>
				</MapContainer>
			</div>
			<h4 className={style.mapTitle}>{blockContent[`content1_${language}`]}</h4>
		</>
	);
};

export default SimpleMapBlock;
