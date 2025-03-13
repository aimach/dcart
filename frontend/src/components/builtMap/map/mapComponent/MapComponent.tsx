// import des bibliothèques
import { useEffect, useState, useMemo } from "react";
import {
	MapContainer,
	TileLayer,
	ScaleControl,
	ZoomControl,
} from "react-leaflet";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router";
// import des composants
import LoaderComponent from "../../../common/loader/LoaderComponent";
import ModalComponent from "../../../common/modal/ModalComponent";
import MarkerComponent from "../MarkerComponent/MarkerComponent";
import ResetControl from "../controls/ResetControlComponent";
import SearchFormComponent from "../searchFormComponent/SearchFormComponent";
import TimeFilterComponent from "../../aside/filterComponents/TimeFilterComponent";
import TileLayerChoiceComponent from "../tileLayerChoice/TileLayerChoiceComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import { getPointsTimeMarkers } from "../../../../utils/functions/filter";
// import des types
import type { LatLngTuple } from "leaflet";
import type { MapInfoType, PointType } from "../../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";
// import du style
import "leaflet/dist/leaflet.css";
import style from "./mapComponent.module.scss";
import "./mapComponent.css";
// import des images
import delta from "../../../../assets/delta.png";

interface MapComponentProps {
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
}

/**
 * Composant de la carte
 * @param {Dispatch<SetStateAction<boolean>>} props.setPanelDisplayed - Modifie l'état d'affichage du panel latéral
 * @returns ModalComponent | MapContainer | LoaderComponent | TimeFilterComponent | TileLayerChoiceComponent
 */
const MapComponent = ({ setPanelDisplayed }: MapComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération de l'id de la carte en cours
	const { mapId } = useParams();

	// récupération des données du store
	const {
		map,
		setMap,
		mapInfos,
		allPoints,
		mapReady,
		resetSelectedMarker,
		tileLayerURL,
	} = useMapStore(useShallow((state) => state));
	const { resetUserFilters } = useMapFiltersStore(
		useShallow((state) => ({
			resetUserFilters: state.resetUserFilters,
		})),
	);
	const { setSelectedTabMenu } = useMapAsideMenuStore(
		useShallow((state) => ({
			setSelectedTabMenu: state.setSelectedTabMenu,
		})),
	);

	// définition de l'état d'affichage de la modale
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

	// définition du centre de la carte
	const mapCenter: LatLngTuple = [40.43, 16.52];

	// au montage du composant, réinitialisation de l'onglet sélectionné et ouverture de la modale (au cas où l'utilisateur viendrait d'une autre carte)
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setSelectedTabMenu("results");
		setIsModalOpen(true);
		resetSelectedMarker();
	}, []);

	// réinitialisation des filtres utilisateur si la modale est ouverte (s'exécute quand l'utilisateur change de carte)
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		resetUserFilters();
	}, [isModalOpen]);

	const [timeFilterIsDisabled, setTimeFilterIsDisabled] =
		useState<boolean>(false);

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

		// s'il n'y a pas de dates dans les points, désactivation du filtre temporel
		const timeMarkers = getPointsTimeMarkers(allPoints);
		const isDisabled = !timeMarkers.post && !timeMarkers.ante;
		setTimeFilterIsDisabled(isDisabled);
	}, [bounds]);

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
		<>
			{!mapReady && <LoaderComponent size={50} />}
			<div className="built-map" id="built-map">
				<section className="leaflet-container">
					{isModalOpen && (
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
										<h3>{(mapInfos as MapInfoType)[`title_${language}`]}</h3>
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
								{allMemoizedPoints.length ? (
									allMemoizedPoints.map((point: PointType) => {
										return (
											<MarkerComponent
												key={point.key}
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
