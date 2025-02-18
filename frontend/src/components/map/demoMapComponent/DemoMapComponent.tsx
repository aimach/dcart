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
import ModalComponent from "../../modal/ModalComponent";
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapFormStore } from "../../../utils/stores/mapFormStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { LatLngTuple } from "leaflet";
import type { MapInfoType, PointType } from "../../../utils/types/mapTypes";
// import du style
import "leaflet/dist/leaflet.css";
import style from "./demoMapComponent.module.scss";
import "./demoMapComponent.css";
// import des images
import delta from "../../../assets/delta.png";

interface DemoMapComponentProps {
	showModal: boolean;
}

const DemoMapComponent = ({ showModal }: DemoMapComponentProps) => {
	// on définit le centre de la carte
	const mapCenter: LatLngTuple = [40.43, 16.52];

	// on gère l'affichage de la modale
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

	// on récupère les informations du context
	const { translation, language } = useContext(TranslationContext);

	const { map, setMap, mapInfos, allPoints, visualReady } = useMapFormStore(
		useShallow((state) => state),
	);

	// à l'arrivée sur la page, on remet les states à 0
	useEffect(() => {
		setIsModalOpen(true);
	}, []);

	// on met à jour les limites de la carte
	const bounds: LatLngTuple[] = [];
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (allPoints.length) {
			for (const point of allPoints) {
				bounds.push([point.latitude, point.longitude]);
			}
			if (map) {
				map.fitBounds(bounds);
			}
		}
	}, [allPoints]);

	return visualReady ? (
		<>
			{/* {!mapReady && <LoaderComponent size={50} />} */}
			<div className="map" id="map">
				<section className="leaflet-container">
					{showModal && isModalOpen && (
						<ModalComponent onClose={() => setIsModalOpen(false)} isDemo={true}>
							{mapInfos && (
								<div className={style.modalContent}>
									<div className={style.modalTitleSection}>
										<img src={delta} alt="decoration" width={30} />
										<h3>{(mapInfos as MapInfoType)[`name_${language}`]}</h3>
										<img src={delta} alt="decoration" width={30} />
									</div>
									<p>{(mapInfos as MapInfoType)[`description_${language}`]}</p>
								</div>
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
						{/* {mapReady && ( */}
						<>
							<TileLayer
								opacity={0.8}
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png"
							/>
							{allPoints.length ? (
								allPoints.map((point: PointType) => {
									return <MarkerComponent key={uuidv4()} point={point} />;
								})
							) : (
								<div>{translation[language].mapPage.noResult}</div>
							)}
							<ZoomControl position="topright" />
							<ScaleControl position="bottomright" />
						</>
						{/* )} */}
					</MapContainer>
				</section>
			</div>
		</>
	) : (
		<div className={style.visualPreload}>Le visuel apparaîtra ici</div>
	);
};

export default DemoMapComponent;
