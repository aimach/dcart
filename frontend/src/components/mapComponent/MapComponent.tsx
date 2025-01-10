// import des bibliothèques
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import du style
import "leaflet/dist/leaflet.css";
import "./mapComponent.css";
import style from "./mapComponent.module.scss";

const MapComponent = () => {
	return (
		<div className="map" id="map">
			<section className="leaflet-container">
				<MapContainer center={[40.43, 16.52]} zoom={5} scrollWheelZoom={false}>
					{/* Layer principal */}
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png"
					/>
					<Marker position={[40.43, 16.52]}>
						<Popup>
							A pretty CSS3 popup. <br /> Easily customizable.
						</Popup>
					</Marker>
				</MapContainer>
			</section>
		</div>
	);
};

export default MapComponent;
