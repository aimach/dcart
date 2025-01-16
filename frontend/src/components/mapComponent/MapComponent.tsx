// import des bibliothèques
import { useEffect, useState } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	ScaleControl,
	Tooltip,
} from "react-leaflet";
import L, { icon } from "leaflet";
// import des services
import {
	getBackGroundColorClassName,
	getIconSize,
} from "../../utils/functions/functions";
// import des types
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import type { PointType } from "../../types/mapTypes";
// import du style
import "leaflet/dist/leaflet.css";
import "./mapComponent.css";
import style from "./mapComponent.module.scss";

interface MapComponentProps {
	toggleButtons: { [key: string]: boolean };
	setToggleButtons: (toggleButtons: { [key: string]: boolean }) => void;
	points: PointType[];
}

const MapComponent = ({
	toggleButtons,
	setToggleButtons,
	points,
}: MapComponentProps) => {
	const [map, setMap] = useState<LeafletMap | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (map) {
			(map as LeafletMap).invalidateSize();
		}
	}, [toggleButtons]);

	const bounds: LatLngTuple[] = [];
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		// on prépare le tableau des bounds
		for (const point of points) {
			bounds.push([point.latitude, point.longitude]);
		}
		// si la map est initialisée, on
		if (map) {
			map.fitBounds(bounds);
		}
	}, [bounds, points]);

	return (
		<div className="map" id="map">
			<section className="leaflet-container">
				<MapContainer
					center={[40.43, 16.52]}
					zoom={5}
					minZoom={4}
					maxZoom={11}
					ref={setMap}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png"
					/>
					{points.map((point: PointType) => {
						// on créé une clé pour chaque point
						const keyPoint = `${point.latitude}-${point.longitude}`;
						// on génère un nom de classe à partir du nombre de sources
						const backgroundColorClassName = getBackGroundColorClassName(
							point.sources.length,
						);
						const iconSize = getIconSize(point.sources.length);
						// Création d'un DivIcon avec du texte et un style circulaire
						const circleBrownIcon = L.divIcon({
							className: `${style.circleBrownIcon} ${style[backgroundColorClassName]}`,
							html: `<div>${point.sources.length}</div>`, // si j'ajoute une class sur cette div, je peux modifier également le style du tooltip
							iconSize: [iconSize, iconSize], // Dimensions du conteneur
							iconAnchor: [iconSize / 2, iconSize / 2], // Centre du marqueur
						});
						return (
							<Marker
								key={keyPoint}
								position={[point.latitude, point.longitude]}
								icon={circleBrownIcon}
								eventHandlers={{
									click: () =>
										setToggleButtons({ ...toggleButtons, left: true }),
								}}
							>
								<Tooltip direction="top" offset={[0, -10]}>
									{point.nom_ville}
								</Tooltip>
							</Marker>
						);
					})}
					<ScaleControl />
				</MapContainer>
			</section>
		</div>
	);
};

export default MapComponent;
