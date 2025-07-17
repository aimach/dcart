// import des bibliothèques
import { useEffect, useState, useMemo } from "react";
import {
	MapContainer,
	TileLayer,
	ScaleControl,
	ZoomControl,
} from "react-leaflet";
import { Link, useParams } from "react-router";
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
import MobileTutorialModalContent from "../../../common/modal/tutorial/MobileTutorialModalContent";
import OrientationControl from "../controls/OrientationControlComponent";
import MapClickHandler from "../controls/MapClickHandler";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import { getPointsTimeMarkers } from "../../../../utils/functions/filter";
import {
	getAllPointsByMapId,
	getOneMapInfosById,
	getOneMapInfosBySlug,
} from "../../../../utils/api/builtMap/getRequests";
import { getMapAttribution } from "../../../../utils/functions/map";
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";
import { useMapFilterReminderStore } from "../../../../utils/stores/builtMap/mapFilterReminderStore";
import { MapPageHelmetContent } from "../../../helmet/HelmetContent";
// import des types
import type { LatLngTuple } from "leaflet";
// import du style
import "leaflet/dist/leaflet.css";
import style from "./mapComponent.module.scss";
import "./mapComponent.css";

/**
 * Composant de la carte
 * @returns ModalComponent | MapContainer | LoaderComponent | TimeFilterComponent | TileLayerChoiceComponent
 */
const MapComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	const { isMobile } = useWindowSize();

	const { mapSlug, mapId } = useParams();

	// récupération des données du store
	const {
		map,
		setMap,
		mapInfos,
		setMapInfos,
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
		useMapFiltersStore(useShallow((state) => state));
	const { setSelectedTabMenu, setIsPanelDisplayed } = useMapAsideMenuStore(
		useShallow((state) => state),
	);
	const { resetInitialOptions, resetFilteredOptions } =
		useMapFilterOptionsStore();
	const { resetFilterReminders, resetTemporaryReminderValues } =
		useMapFilterReminderStore();

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
		resetInitialOptions();
		resetFilteredOptions();
		resetUserFilters();
		resetTemporaryReminderValues();
	}, [mapSlug, mapId]);

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
			map.fitBounds(bounds, { padding: [150, 150] });
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
		resetInitialOptions();
		resetFilterReminders();
		resetTemporaryReminderValues();
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

	const fetchMapInfos = async () => {
		if (mapSlug) {
			const allMapInfos = await getOneMapInfosBySlug(mapSlug as string);
			setMapInfos(allMapInfos);
		} else {
			const allMapInfos = await getOneMapInfosById(mapId as string);
			setMapInfos(allMapInfos);
		}
	};

	const tileAttribution = getMapAttribution(tileLayerURL);

	// au montage, ajout d'un label aux boutons de zoom pour l'accessibilité
	useEffect(() => {
		const zoomIn = document.querySelector(".leaflet-control-zoom-in");
		const zoomOut = document.querySelector(".leaflet-control-zoom-out");

		if (zoomIn) zoomIn.setAttribute("aria-label", "Zoomer");
		if (zoomOut) zoomOut.setAttribute("aria-label", "Dézoomer");
	}, []);

	return (
		<>
			<MapPageHelmetContent
				mapName={mapInfos?.[`title_${language}`] ?? " Exploration"}
			/>
			{!mapReady && <LoaderComponent size={50} />}
			<div className={mapContainerClassName} id="built-map">
				<section className="leaflet-container">
					{isModalOpen && allMemoizedPoints.length > 0 && (
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
							<div className={style.noResultContainer}>
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
							</div>
						</ModalComponent>
					)}
					{isTutorialOpen && (
						<ModalComponent
							onClose={() => {
								closeTutorial();
								resetTutorialStep();
								setIsPanelDisplayed(false);
							}}
						>
							{isMobile ? (
								<MobileTutorialModalContent />
							) : (
								<TutorialModalContent />
							)}
						</ModalComponent>
					)}
					{/* enveloppé dans une section pour l'accessibilité */}
					<section
						aria-label={`Carte interactive ${mapInfos?.[`title_${language}`] ?? `Carte d'exploration`}`}
					>
						<MapContainer
							center={mapCenter}
							zoomControl={false}
							minZoom={4}
							maxZoom={11}
							ref={setMap}
						>
							{location.hash.includes("maps/preview/") && (
								<div
									style={{
										position: "absolute",
										top: 10,
										left: 10,
										zIndex: 400,
									}}
								>
									<Link
										to={`/backoffice/maps/edit/${mapId}`}
										state={{ from: location.pathname }}
									>
										<ButtonComponent
											type="button"
											textContent={
												translation[language].backoffice.storymapFormPage
													.backToEdit
											}
											color="brown"
											onClickFunction={() => {
												fetchMapInfos();
											}}
										/>
									</Link>
								</div>
							)}
							<MapTitleComponent
								setIsModalOpen={setIsModalOpen}
								mapBounds={bounds}
								fetchAllPoints={fetchAllPoints}
							/>
							{mapReady && (
								<>
									<TileLayer
										opacity={0.6}
										attribution={`dCART | &copy; ${tileAttribution}`}
										url={tileLayerURL}
									/>
									{!mapInfos?.isLayered && allMemoizedPoints.length > 0 && (
										<SimpleLayerComponent
											allMemoizedPoints={allMemoizedPoints}
										/>
									)}
									{mapInfos?.isLayered && allMemoizedPoints.length > 0 && (
										<MultipleLayerComponent
											allMemoizedPoints={allMemoizedPoints}
										/>
									)}
									<ZoomControl position="bottomleft" />
									<ScaleControl position="bottomright" />
									<OrientationControl />
									<MapClickHandler deselectFunction={resetSelectedMarker} />
								</>
							)}
						</MapContainer>
					</section>
				</section>
				{mapReady && !isMobile && (
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
