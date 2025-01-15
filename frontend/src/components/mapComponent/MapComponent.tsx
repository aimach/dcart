// import des bibliothèques
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
// import des services
import { getBackGroundColorClassName } from "../../utils/functions/functions";
// import des types
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import type { PointType } from "../../types/mapTypes";
// import du style
import "leaflet/dist/leaflet.css";
import "./mapComponent.css";
import style from "./mapComponent.module.scss";

interface MapComponentProps {
	toggleButtons: { [key: string]: boolean };
	points: PointType[];
}

const MapComponent = ({ toggleButtons, points }: MapComponentProps) => {
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
				<MapContainer center={[40.43, 16.52]} zoom={5} ref={setMap}>
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
						// Création d'un DivIcon avec du texte et un style circulaire
						const customIcon = L.divIcon({
							className: `${style.customCircleIcon} ${style[backgroundColorClassName]}`,
							html: `<div>${point.sources.length}</div>`, // si j'ajoute une class sur cette div, je peux modifier également le style du tooltip
							iconSize: [30, 30], // Dimensions du conteneur
							iconAnchor: [20, 20], // Centre du marqueur
						});
						return (
							<Marker
								key={keyPoint}
								position={[point.latitude, point.longitude]}
								icon={customIcon}
							/>
						);
					})}
				</MapContainer>
			</section>
		</div>
	);
};

export default MapComponent;
