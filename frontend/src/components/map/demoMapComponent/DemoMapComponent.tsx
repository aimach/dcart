// import des bibliothèques
import { useContext, useEffect, useState, useMemo } from "react";
import {
	MapContainer,
	TileLayer,
	ScaleControl,
	ZoomControl,
	Marker,
} from "react-leaflet";
import { v4 as uuidv4 } from "uuid";
// import des composants
import ModalComponent from "../../modal/ModalComponent";
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
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
import { getAllPointsForDemoMap } from "../../../utils/api/getRequests";

interface DemoMapComponentProps {
	showModal: boolean;
}

/**
 * Composant de la carte de démonstration
 * @param {Object} props
 * @param {boolean} props.showModal - Affiche la modale
 * @returns ModalComponent | MapContainer
 */
const DemoMapComponent = ({ showModal }: DemoMapComponentProps) => {
	// on définit le centre de la carte
	const mapCenter: LatLngTuple = [40.43, 16.52];

	// on gère l'affichage de la modale
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

	// on récupère les informations du context
	const { translation, language } = useContext(TranslationContext);

	const {
		map,
		setMap,
		mapInfos,

		setAllPoints,
		allPoints,
		visualReady,
	} = useMapFormStore(useShallow((state) => state));

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

	// si les points sont chargés, on les affiche
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const fetchAllPointsForDemoMap = async (attestationIds: string) => {
			const points = await getAllPointsForDemoMap(attestationIds);
			setAllPoints(points);
		};
		if (mapInfos?.attestationIds) {
			fetchAllPointsForDemoMap(mapInfos.attestationIds);
		}
	}, [mapInfos]);

	// on génère des uuid() pour les keys des composants
	const allMemoizedPoints = useMemo(
		() =>
			allPoints.map((point) => ({
				...point,
				key: uuidv4(),
			})),
		[allPoints], // Se régénère seulement si allPoints change
	);

	return visualReady ? (
		<div className="demo-map" id="demo-map">
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
					zoom={5}
					ref={setMap}
				>
					<TileLayer
						opacity={0.8}
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png"
					/>
					{allMemoizedPoints.length > 0 ? (
						allMemoizedPoints.map((point: PointType) => {
							return <MarkerComponent key={point.key} point={point} />;
						})
					) : (
						<Marker position={[40.43, 16.52]} />
					)}
					<ZoomControl position="topright" />
					<ScaleControl position="bottomright" />
				</MapContainer>
			</section>
		</div>
	) : (
		<div className={style.visualPreload}>Le visuel apparaîtra ici</div>
	);
};

export default DemoMapComponent;
