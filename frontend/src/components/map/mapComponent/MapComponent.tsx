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
import ResetControl from "../controls/ResetControlComponent";
import SearchFormComponent from "../searchFormComponent/SearchFormComponent";
import TimeFilterComponent from "../../aside/filterComponents/TimeFilterComponent";
import TileLayerChoiceComponent from "../tileLayerChoice/TileLayerChoiceComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
import { useShallow } from "zustand/shallow";
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { getPointsTimeMarkers } from "../../../utils/loaders/loaders";
// import des types
import type { LatLngTuple } from "leaflet";
import type { MapInfoType, PointType } from "../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";
// import du style
import "leaflet/dist/leaflet.css";
import style from "./mapComponent.module.scss";
import "./mapComponent.css";
// import des images
import delta from "../../../assets/delta.png";

interface MapComponentProps {
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
	mapId: string;
}

const MapComponent = ({ setPanelDisplayed, mapId }: MapComponentProps) => {
	// on définit le centre de la carte
	const mapCenter: LatLngTuple = [40.43, 16.52];

	// on récupère le fond de carte
	const { tileLayerURL } = useMapStore((state) => state);

	// on récupère les filtres de l'utilisateur dans le store
	const { userFilters, setUserFilters, resetUserFilters } = useMapFiltersStore(
		useShallow((state) => ({
			userFilters: state.userFilters,
			setUserFilters: state.setUserFilters,
			resetUserFilters: state.resetUserFilters,
		})),
	);

	// on gère l'affichage de la modale
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

	// on récupère les informations du context
	const { translation, language } = useContext(TranslationContext);

	// on récupère les informations du store
	const { setSelectedTabMenu } = useMapAsideMenuStore(
		useShallow((state) => ({
			setSelectedTabMenu: state.setSelectedTabMenu,
		})),
	);
	const { map, setMap, mapInfos, allPoints, mapReady, resetSelectedMarker } =
		useMapStore(useShallow((state) => state));

	// à l'arrivée sur la page, on remet les states à 0
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setSelectedTabMenu("results");
		setIsModalOpen(true);
		resetSelectedMarker();
	}, []);

	// on s'assure que les filtres sont mis à 0
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		resetUserFilters();
	}, [isModalOpen]);

	// on met à jour les limites de la carte
	const bounds: LatLngTuple[] = [];
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (allPoints.length) {
			// on récupère les limites de la carte
			for (const point of allPoints) {
				bounds.push([point.latitude, point.longitude]);
			}
			if (map) {
				map.fitBounds(bounds);
			}
		}
	}, [allPoints]);

	// RECUPERATION DES MARKERS TEMPORELS  POUR LES FILTRES
	const [timeFilterIsDisabled, setTimeFilterIsDisabled] =
		useState<boolean>(false);

	return (
		<>
			{!mapReady && <LoaderComponent size={50} />}
			<div className="map" id="map">
				<section className="leaflet-container">
					{isModalOpen && mapInfos && (
						<ModalComponent
							onClose={() => setIsModalOpen(false)}
							isDemo={false}
						>
							{mapId === "exploration" && (
								<SearchFormComponent setIsModalOpen={setIsModalOpen} />
							)}
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
						{mapReady && (
							<>
								<TileLayer
									opacity={0.6}
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url={tileLayerURL}
								/>
								{allPoints.length ? (
									allPoints.map((point: PointType) => {
										return (
											<MarkerComponent
												key={uuidv4()}
												point={point}
												setPanelDisplayed={setPanelDisplayed}
											/>
										);
									})
								) : (
									<div>{translation[language].mapPage.noResult}</div>
								)}
								<ZoomControl position="topright" />
								<ScaleControl position="bottomright" />
								{/* <ResetControl mapBounds={bounds} /> */}
							</>
						)}
					</MapContainer>
				</section>
				{mapReady && (
					<section className={style.mapBottomSection}>
						<TimeFilterComponent disabled={timeFilterIsDisabled} />
						<TileLayerChoiceComponent />
					</section>
				)}
			</div>
		</>
	);
};

export default MapComponent;
