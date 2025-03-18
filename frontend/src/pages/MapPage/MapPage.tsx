// import des bibliothèques
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
// import des composants
import MapComponent from "../../components/builtMap/map/mapComponent/MapComponent";
import AsideContainer from "../../components/builtMap/aside/asideContainer/AsideContainer";
import AsideReducedMenuComponent from "../../components/builtMap/aside/asideReducedMenu/AsideReducedMenuComponent";
// import des services
import {
	getAllPointsByMapId,
	getOneMapInfos,
} from "../../utils/api/builtMap/getRequests";
import { useShallow } from "zustand/shallow";
import { useMapStore } from "../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../utils/stores/builtMap/mapAsideMenuStore";
// import du style
import style from "./mapPage.module.scss";
import UserMapFilterForm from "../../components/form/mapForm/userMapFilterForm/UserMapFilterForm";
import { useMapFiltersStore } from "../../utils/stores/builtMap/mapFiltersStore";

/**
 * Page de la carte
 * @returns AsideContainer | AsideReducedMenuComponent | MapComponent
 */
const MapPage = () => {
	// récupération des paramètres de l'URL : l'id de la carte en cours
	const { mapId } = useParams();

	// état pour gérer l'affichage du panneau latéral
	const [panelDisplayed, setPanelDisplayed] = useState<boolean>(true);

	// récupération des données des stores
	const setMapFilters = useMapAsideMenuStore((state) => state.setMapFilters);
	const mapStore = useMapStore(
		useShallow((state) => ({
			setMapInfos: state.setMapInfos,
			allPoints: state.allPoints,
			setAllPoints: state.setAllPoints,
			setIncludedElementId: state.setIncludedElementId,
			mapReady: state.mapReady,
			setMapReady: state.setMapReady,
			resetTileLayerURL: state.resetTileLayerURL,
		})),
	);

	// fonction pour récupérer les points de la carte en cours
	const fetchAllPoints = useCallback(async () => {
		const points = await getAllPointsByMapId(mapId as string, null);
		mapStore.setAllPoints(points);
		mapStore.setMapReady(true);
	}, [mapId, mapStore]);

	// fonction pour récupérer les informations de la carte
	const fetchMapInfos = useCallback(
		async (mapId: string) => {
			if (!mapId) return;
			const mapInfos = await getOneMapInfos(mapId as string);
			// si la carte est une carte d'exploration, on réinitialise les filtres
			if (mapInfos === "exploration") {
				mapStore.setIncludedElementId(undefined);
				mapStore.setMapInfos(null);
				setMapFilters([]);
			} else {
				// sinon on charge les informations de la carte
				mapStore.setIncludedElementId(mapInfos.divinityIds);
				mapStore.setMapInfos(mapInfos);
				setMapFilters(mapInfos.filters);
			}
		},
		[mapStore, setMapFilters],
	);

	// chargement des données de la carte au montage du composant et réinitialisation des états
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		// chargement des données
		fetchMapInfos(mapId as string);
		fetchAllPoints();
		// réinitialisation des états si l'utilisateur vient d'une autre carte
		mapStore.setMapReady(false);
		mapStore.resetTileLayerURL();
		setPanelDisplayed(false);
	}, [mapId]);

	const { isReset } = useMapFiltersStore();

	return (
		<section className={style.mapSection} key={isReset ? "reset" : "filter"}>
			{/* <MapMenuNav categoryId={categoryId as string} /> */}
			<section className={style.mapSectionMain}>
				{panelDisplayed ? (
					<AsideContainer
						panelDisplayed={panelDisplayed}
						setPanelDisplayed={setPanelDisplayed}
					/>
				) : (
					<AsideReducedMenuComponent setPanelDisplayed={setPanelDisplayed} />
				)}

				<section
					className={mapStore.mapReady ? undefined : style.mapSectionLoaded}
				>
					<MapComponent setPanelDisplayed={setPanelDisplayed} />
				</section>
			</section>
		</section>
	);
};

export default MapPage;
