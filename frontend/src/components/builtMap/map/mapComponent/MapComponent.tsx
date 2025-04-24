// import des bibliothèques
import { useEffect, useState, useMemo } from "react";
import {
	MapContainer,
	TileLayer,
	ScaleControl,
	ZoomControl,
} from "react-leaflet";
import { v4 as uuidv4 } from "uuid";
// import des composants
import LoaderComponent from "../../../common/loader/LoaderComponent";
import ModalComponent from "../../../common/modal/ModalComponent";
import TimeFilterComponent from "../../aside/filterComponents/TimeFilterComponent";
import TileLayerChoiceComponent from "../tileLayerChoice/TileLayerChoiceComponent";
import MapTitleComponent from "../mapTitleComponent/MapTitleComponent";
import MapIntroductionContent from "../../../common/modal/MapIntroductionContent";
import SimpleLayerComponent from "../simpleLayerComponent/SimpleLayerComponent";
import MultipleLayerComponent from "../multipleLayerComponent/MultipleLayerComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
import TutorialModalContent from "../../../common/modal/tutorial/TutorialModalContent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import { getPointsTimeMarkers } from "../../../../utils/functions/filter";
import { getAllPointsByMapId } from "../../../../utils/api/builtMap/getRequests";
// import des types
import type { LatLngTuple } from "leaflet";
// import du style
import "leaflet/dist/leaflet.css";
import style from "./mapComponent.module.scss";
import "./mapComponent.css";
import { Link } from "react-router";

/**
 * Composant de la carte
 * @returns ModalComponent | MapContainer | LoaderComponent | TimeFilterComponent | TileLayerChoiceComponent
 */
const MapComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données du store
	const {
		map,
		setMap,
		mapInfos,
		allPoints,
		setAllPoints,
		setAllResults,
		addLayer,
		removeLayer,
		mapReady,
		setMapReady,
		resetSelectedMarker,
		tileLayerURL,
		tutorialStep,
		isTutorialOpen,
		closeTutorial,
		resetTutorialStep,
	} = useMapStore(useShallow((state) => state));
	const { userFilters, resetUserFilters, isReset, setIsReset } =
		useMapFiltersStore(
			useShallow((state) => ({
				userFilters: state.userFilters,
				resetUserFilters: state.resetUserFilters,
				isReset: state.isReset,
				setIsReset: state.setIsReset,
			})),
		);
	const { setSelectedTabMenu, setIsPanelDisplayed } = useMapAsideMenuStore(
		useShallow((state) => ({
			setSelectedTabMenu: state.setSelectedTabMenu,
			setIsPanelDisplayed: state.setIsPanelDisplayed,
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
		if (isModalOpen && allPoints.length > 0) {
			resetUserFilters();
		}
	}, [isModalOpen, allPoints]);

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
		if (bounds.length === 0) {
			setIsModalOpen(true);
		}

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

	// fonction pour mettre à jour les filtres et les points si pas de résultats
	const fetchAllPoints = async (type: "filter" | "reset") => {
		setMapReady(false);
		const mapId = mapInfos?.id ?? "exploration";
		const points = await getAllPointsByMapId(
			mapId,
			type === "filter" ? userFilters : null,
		);
		setAllPoints(points);
		setAllResults(points);
		setMapReady(true);
	};
	const resetFiltersAndFetchPoints = () => {
		resetUserFilters();
		setIsReset(!isReset);
		// on recharge les points de la carte
		fetchAllPoints("reset");
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (!map) return;

		map.on("overlayremove", (e) => {
			const layerName = e.name;
			removeLayer(layerName);
		});
		map.on("overlayadd", (e) => {
			const layerName = e.name;
			addLayer(layerName);
		});
	}, [map]);

	const mapContainerClassName =
		tutorialStep === 2 ? "built-map shadowed" : "built-map";

	return (
		<>
			{!mapReady && <LoaderComponent size={50} />}
			<div className={mapContainerClassName} id="built-map">
				<section className="leaflet-container">
					{/* {isModalOpen && allMemoizedPoints.length > 0 && (
						<ModalComponent
							onClose={() => {
								setIsModalOpen(false);
							}}
						>
							<MapIntroductionContent setIsModalOpen={setIsModalOpen} />
						</ModalComponent>
					)}
					{mapReady && isModalOpen && allMemoizedPoints.length === 0 && (
						<ModalComponent onClose={() => setIsModalOpen(false)}>
							{translation[language].mapPage.noResult}
							<br />
							{translation[language].mapPage.enlargeYourSearch}

							<br />
							<ButtonComponent
								type="button"
								color="brown"
								textContent={translation[language].button.resetFilter}
								onClickFunction={() => {
									setIsModalOpen(false);
									resetFiltersAndFetchPoints();
								}}
							/>
						</ModalComponent>
					)} */}
					{isTutorialOpen && (
						<ModalComponent
							onClose={() => {
								closeTutorial();
								resetTutorialStep();
								setIsPanelDisplayed(false);
							}}
						>
							<TutorialModalContent />
						</ModalComponent>
					)}
					<MapContainer
						center={mapCenter}
						zoomControl={false}
						minZoom={4}
						maxZoom={11}
						ref={setMap}
					>
						{location.pathname.includes("maps/preview/") && (
							<div
								style={{
									position: "absolute",
									top: 10,
									left: 10,
									zIndex: 400,
								}}
							>
								<Link
									to={`/backoffice/maps/edit/${mapInfos?.id}`}
									state={{ from: location.pathname }}
								>
									<ButtonComponent
										type="button"
										textContent={
											translation[language].backoffice.storymapFormPage
												.backToEdit
										}
										color="brown"
									/>
								</Link>
							</div>
						)}
						<MapTitleComponent setIsModalOpen={setIsModalOpen} />
						{mapReady && (
							<>
								<TileLayer
									opacity={0.6}
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url={tileLayerURL}
								/>
								{!mapInfos?.isLayered && allMemoizedPoints.length > 0 && (
									<SimpleLayerComponent allMemoizedPoints={allMemoizedPoints} />
								)}
								{mapInfos?.isLayered && allMemoizedPoints.length > 0 && (
									<MultipleLayerComponent
										allMemoizedPoints={allMemoizedPoints}
									/>
								)}
								<ZoomControl position="bottomleft" />
								<ScaleControl position="bottomleft" />
								{/* <ResetControl mapBounds={bounds} /> */}
							</>
						)}
					</MapContainer>
				</section>
				{mapReady && (
					<section
						className={
							tutorialStep === 4
								? `${style.mapBottomSection} ${style.mapBottomSectionWhite}`
								: style.mapBottomSection
						}
					>
						{allPoints.length > 0 && (
							<TimeFilterComponent disabled={timeFilterIsDisabled} />
						)}
						<TileLayerChoiceComponent />
					</section>
				)}
			</div>
		</>
	);
};

export default MapComponent;
