// import des bibliothèques
import { useState, useEffect } from "react";
import { useParams } from "react-router";
// import des composants
import MapComponent from "../../components/map/mapComponent/MapComponent";
import AsideContainer from "../../components/aside/asideContainer/AsideContainer";
import AsideReducedMenuComponent from "../../components/aside/asideReducedMenu/AsideReducedMenuComponent";
// import des services
import {
	getAllPointsByMapId,
	getOneMapInfos,
} from "../../utils/api/getRequests";
import { useShallow } from "zustand/shallow";
import { useMapStore } from "../../utils/stores/mapStore";
import { useMapAsideMenuStore } from "../../utils/stores/mapAsideMenuStore";
// import du style
import style from "./mapPage.module.scss";

/**
 * Page de la carte
 * @returns AsideContainer | AsideReducedMenuComponent | MapComponent
 */
const MapPage = () => {
	// Import des hooks
	const { mapId } = useParams();
	const [panelDisplayed, setPanelDisplayed] = useState<boolean>(true);

	// Récupération des données externes (context, store, params, etc.)
	const setMapFilters = useMapAsideMenuStore((state) => state.setMapFilters);
	const {
		setMapInfos,
		allPoints,
		setAllPoints,
		setIncludedElementId,
		mapReady,
		setMapReady,
		resetTileLayerURL,
	} = useMapStore(useShallow((state) => state));

	// Déclaration des fonctions internes
	const fetchAllPoints = async () => {
		const points = await getAllPointsByMapId(mapId as string, null);
		setAllPoints(points);
		setMapReady(true);
	};
	const fetchMapInfos = async (mapId: string) => {
		const mapInfos = await getOneMapInfos(mapId as string);
		// si la carte est une carte d'exploration, on réinitialise les filtres
		if (mapInfos === "exploration") {
			setIncludedElementId(undefined);
			setMapInfos(null);
			setMapFilters([]);
		} else {
			// sinon on charge les informations de la carte
			setIncludedElementId(mapInfos.divinityIds);
			setMapInfos(mapInfos);
			setMapFilters(mapInfos.filters);
		}
	};

	// Effets secondaires (useEffect, useMemo, useCallback)
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setMapReady(false);
		setPanelDisplayed(false);
		fetchMapInfos(mapId as string);
		fetchAllPoints();
		resetTileLayerURL();
	}, [mapId]);

	// Retour du JSX
	return (
		<section className={style.mapSection}>
			{/* <MapMenuNav categoryId={categoryId as string} /> */}
			<section className={style.mapSectionMain}>
				{panelDisplayed ? (
					<AsideContainer
						panelDisplayed={panelDisplayed}
						setPanelDisplayed={setPanelDisplayed}
						allPoints={allPoints}
						mapId={mapId as string}
					/>
				) : (
					<AsideReducedMenuComponent setPanelDisplayed={setPanelDisplayed} />
				)}

				<section className={mapReady ? undefined : style.mapSectionLoaded}>
					<MapComponent
						setPanelDisplayed={setPanelDisplayed}
						mapId={mapId as string}
					/>
				</section>
			</section>
		</section>
	);
};

export default MapPage;
