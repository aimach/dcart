// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import {
	MapContainer,
	TileLayer,
	ScaleControl,
	ZoomControl,
} from "react-leaflet";
import { v4 as uuidv4 } from "uuid";
// import des composants
import LoaderComponent from "../../common/loader/LoaderComponent";
import ModalComponent from "../../modal/ModalComponent";
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import du context
import { MapAsideMenuContext } from "../../../context/MapAsideMenuContext";
import { MapContext } from "../../../context/MapContext";
// import des types
import type { LatLngTuple } from "leaflet";
import type { MapInfoType, PointType } from "../../../types/mapTypes";
import type { Dispatch, SetStateAction } from "react";
// import du style
import "leaflet/dist/leaflet.css";
import "./mapComponent.css";
import ResetControl from "../controls/ResetControlComponent";
import SearchFormComponent from "../searchFormComponent/SearchFormComponent";

interface MapComponentProps {
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
	points: PointType[];
	setAllPoints: Dispatch<SetStateAction<PointType[]>>;
	mapReady: boolean;
	mapInfos: MapInfoType | null;
	mapId: string;
}

const MapComponent = ({
	setPanelDisplayed,
	points,
	setAllPoints,
	mapReady,
	mapInfos,
	mapId,
}: MapComponentProps) => {
	const mapCenter: LatLngTuple = [40.43, 16.52];

	// on gère l'affichage de la modale
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

	// on récupère les informations du context
	const { setSelectedTabMenu } = useContext(MapAsideMenuContext);
	const { map, setMap } = useContext(MapContext);

	// à l'arrivée sur la page, on remet les states à 0
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setSelectedTabMenu("results");
		setIsModalOpen(true);
	}, []);

	// on met à jour les limites de la carte
	const bounds: LatLngTuple[] = [];
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setIsModalOpen(true);
		if (points.length) {
			for (const point of points) {
				bounds.push([point.latitude, point.longitude]);
			}
			if (map) {
				map.fitBounds(bounds);
			}
		}
	}, [points]);

	return (
		<>
			{!mapReady && <LoaderComponent />}
			<div className="map" id="map">
				<section className="leaflet-container">
					{isModalOpen && (
						<ModalComponent onClose={() => setIsModalOpen(false)}>
							{mapId === "exploration" && (
								<SearchFormComponent
									setAllPoints={setAllPoints}
									setIsModalOpen={setIsModalOpen}
								/>
							)}
							{mapInfos && (
								<>
									<h3>{(mapInfos as MapInfoType).name}</h3>
									<p>{(mapInfos as MapInfoType).description}</p>
								</>
							)}
						</ModalComponent>
					)}
					<MapContainer
						center={mapCenter}
						zoomControl={false}
						minZoom={4}
						maxZoom={11}
						ref={setMap}
					>
						{mapReady && (
							<>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png"
								/>
								{points.length ? (
									points.map((point: PointType) => {
										return (
											<MarkerComponent
												key={uuidv4()}
												point={point}
												setPanelDisplayed={setPanelDisplayed}
											/>
										);
									})
								) : (
									<div>Aucun résultat</div>
								)}
								<ZoomControl position="topright" />
								<ScaleControl position="bottomright" />
								<ResetControl mapBounds={bounds} />
							</>
						)}
					</MapContainer>
				</section>
			</div>
		</>
	);
};

export default MapComponent;
