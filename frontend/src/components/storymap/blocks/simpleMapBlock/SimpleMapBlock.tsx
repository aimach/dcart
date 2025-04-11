// import des bibliothèques
import { useEffect, useState } from "react";
import {
	MapContainer,
	TileLayer,
	ScaleControl,
	ZoomControl,
	Marker,
	Popup,
} from "react-leaflet";
// import des services
import {
	getBackGroundColorClassName,
	getDefaultIcon,
} from "../../../../utils/functions/icons";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
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

	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

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
							url={blockContent[`content2_${selectedLanguage}`]}
						/>

						{points.length ? (
							points.map((point: GroupedTyped) => {
								// on créé une icone adaptée au nombre de sources
								const backgroundColorClassName =
									point.color ??
									getBackGroundColorClassName(point.attestations.length);
								const icon = getDefaultIcon(
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
											<h4>{point.attestations[0][`title_${selectedLanguage}`] ?? point.attestations[0].location}</h4>
											<p>{point.attestations[0][`description_${selectedLanguage}`] ?? point.attestations[0].location}</p></Popup>
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
			<h4 className={style.mapTitle}>
				{blockContent[`content1_${selectedLanguage}`]}
			</h4>
		</>
	);
};

export default SimpleMapBlock;
