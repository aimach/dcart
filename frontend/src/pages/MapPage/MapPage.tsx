// import des bibliothèques
import { useEffect, useCallback } from "react";
import { useParams } from "react-router";
// import des composants
import MapComponent from "../../components/builtMap/map/mapComponent/MapComponent";
import AsideContainer from "../../components/builtMap/aside/asideContainer/AsideContainer";
import AsideReducedMenuComponent from "../../components/builtMap/aside/asideReducedMenu/AsideReducedMenuComponent";
// import des services
import {
	getAllPointsByMapId,
	getOneMapInfosById,
	getOneMapInfosBySlug,
} from "../../utils/api/builtMap/getRequests";
import { useShallow } from "zustand/shallow";
import { useMapStore } from "../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../utils/stores/builtMap/mapAsideMenuStore";
// import des types
import type { PointSetType } from "../../utils/types/mapTypes";
// import du style
import style from "./mapPage.module.scss";

/**
 * Page de la carte
 * @returns AsideContainer | AsideReducedMenuComponent | MapComponent
 */
const MapPage = () => {
	// récupération des paramètres de l'URL : l'id de la carte en cours
	const { mapSlug, mapId } = useParams();

	// récupération des données des stores
	const { setMapFilters, isPanelDisplayed, setIsPanelDisplayed } =
		useMapAsideMenuStore();
	const mapStore = useMapStore(useShallow((state) => state));

	// fonction pour récupérer les points de la carte en cours
	const fetchAllPoints = useCallback(
		async (mapId: string) => {
			const points = await getAllPointsByMapId(mapId as string, null);
			mapStore.setAllPoints(points);
			mapStore.setAllResults(points);
			mapStore.setMapReady(true);
		},
		[mapStore],
	);

	// fonction pour récupérer les informations de la carte
	const fetchMapInfosAndPoints = useCallback(
		async (mapIdentifier: string, type: string) => {
			let mapInfos = null;
			if (type === "id") {
				mapInfos = await getOneMapInfosById(mapIdentifier as string);
			} else {
				mapInfos = await getOneMapInfosBySlug(mapIdentifier as string);
			}
			// si la carte est une carte d'exploration, on réinitialise les filtres
			if (mapIdentifier === "exploration") {
				mapStore.setIncludedElementId(undefined);
				mapStore.setMapInfos(null);
				setMapFilters([]);
				fetchAllPoints("exploration");
			} else {
				// sinon on charge les informations de la carte
				mapStore.setIncludedElementId(mapInfos.divinityIds);
				mapStore.setMapInfos(mapInfos);
				mapStore.setAllLayers(
					mapInfos.attestations.map(
						(attestation: PointSetType) => attestation.name as string,
					),
				);
				setMapFilters(mapInfos.filterMapContent);
				fetchAllPoints(mapInfos.id);
			}
			return mapInfos;
		},
		[mapStore, setMapFilters, fetchAllPoints],
	);

	// chargement des données de la carte au montage du composant et réinitialisation des états
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchMapInfosAndPoints(
			mapSlug ?? (mapId as string),
			mapSlug ? "slug" : "id",
		);
		// réinitialisation des états si l'utilisateur vient d'une autre carte
		mapStore.setMapReady(false);
		mapStore.resetTileLayerURL();
		setIsPanelDisplayed(false);
	}, [mapSlug, mapId]);

	return (
		<section className={style.mapSection}>
			<section className={style.mapSectionMain}>
				{isPanelDisplayed ? <AsideContainer /> : <AsideReducedMenuComponent />}
				<section
					className={mapStore.mapReady ? undefined : style.mapSectionLoaded}
				>
					<MapComponent />
				</section>
			</section>
		</section>
	);
};

export default MapPage;
