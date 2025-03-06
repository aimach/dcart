// import des bibliothèques
import { useEffect, useState, useMemo } from "react";
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
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../utils/stores/mapFormStore";
import { useShallow } from "zustand/shallow";
import { getAllPointsForDemoMap } from "../../../utils/api/getRequests";
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

/**
 * Composant de la carte de démonstration
 * @param {Object} props
 * @param {boolean} props.showModal - Affiche la modale
 * @returns ModalComponent | MapContainer
 */
const DemoMapComponent = ({ showModal }: DemoMapComponentProps) => {
	// récupération des données de la langue
	const { language } = useTranslation();

	// récupération des données des stores
	const { map, setMap, mapInfos, setAllPoints, allPoints } = useMapFormStore(
		useShallow((state) => state),
	);

	// définition du centre de la carte
	const mapCenter: LatLngTuple = [40.43, 16.52];

	// mise à jour des limites de la carte
	const bounds = useMemo(() => {
		return allPoints.map(
			(point) => [point.latitude, point.longitude] as LatLngTuple,
		);
	}, [allPoints]);
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		// si des points sont affichés, ajustement des limites de la carte
		if (bounds.length && map) {
			map.fitBounds(bounds);
		}
	}, [bounds]);

	// si les ids des attestations sont chargées via le CSV, récupération des points dans la BDD
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

	// génération des uuid() pour les keys des composants (se régénère seulement si allPoints change)
	const allMemoizedPoints = useMemo(
		() =>
			allPoints.map((point) => ({
				...point,
				key: uuidv4(),
			})),
		[allPoints],
	);

	return (
		<div className="demo-map" id="demo-map">
			<section className="leaflet-container">
				{showModal && (
					<ModalComponent isDemo={true}>
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
	);
};

export default DemoMapComponent;
