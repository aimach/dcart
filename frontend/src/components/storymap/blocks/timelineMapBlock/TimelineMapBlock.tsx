// import des bibliothèques
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import des types
import type { LatLngTuple } from "leaflet";
// import du style
import "leaflet/dist/leaflet.css";

const timelineData = [
	{ time: "2023-01-01", coords: [48.8566, 2.3522], name: "Paris" },
	{ time: "2023-02-01", coords: [51.5074, -0.1278], name: "Londres" },
	{ time: "2023-03-01", coords: [52.52, 13.405], name: "Berlin" },
];

const TimelineMapBlock = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % timelineData.length);
		}, 2000); // Change de point toutes les 2 secondes

		return () => clearInterval(interval);
	}, []);

	return (
		<section>
			<div id="map-timeline">
				<MapContainer
					center={timelineData[currentIndex].coords as LatLngTuple}
					zoom={5}
					style={{ height: "500px", width: "100%" }}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution="dCART | &copy; OpenStreetMap contributors"
					/>

					<Marker position={timelineData[currentIndex].coords as LatLngTuple}>
						<Popup>
							{timelineData[currentIndex].name} -{" "}
							{timelineData[currentIndex].time}
						</Popup>
					</Marker>
				</MapContainer>

				<div style={{ textAlign: "center", marginTop: "10px" }}>
					<p>
						<strong>Temps :</strong> {timelineData[currentIndex].time}
					</p>
					<button
						type="button"
						onClick={() =>
							setCurrentIndex(
								(prev) =>
									(prev - 1 + timelineData.length) % timelineData.length,
							)
						}
					>
						◀ Précédent
					</button>
					<button
						type="button"
						onClick={() =>
							setCurrentIndex((prev) => (prev + 1) % timelineData.length)
						}
					>
						Suivant ▶
					</button>
				</div>
			</div>
		</section>
	);
};

export default TimelineMapBlock;
