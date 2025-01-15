// import des bibliothèques
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import des types
import type { Map as LeafletMap } from "leaflet";
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

	return (
		<div className="map" id="map">
			<section className="leaflet-container">
				<MapContainer center={[40.43, 16.52]} zoom={5} ref={setMap}>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png"
					/>
					{points.map((point: PointType) => {
						const keyPoint = `${point.latitude}-${point.longitude}`;
						return (
							<Marker
								key={keyPoint}
								position={[point.latitude, point.longitude]}
							/>
						);
					})}
				</MapContainer>
			</section>
		</div>
	);
};

export default MapComponent;
