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
} from "../../utils/loaders/loaders";
import { useShallow } from "zustand/shallow";
import { useMapStore } from "../../utils/stores/mapStore";
import { useMapAsideMenuStore } from "../../utils/stores/mapAsideMenuStore";
// import du style
import style from "./mapPage.module.scss";

const MapPage = () => {
	// on récupère les params
	const { categoryId, mapId } = useParams();

	// on récupère le state pour l'includedElement
	const {
		setMapInfos,
		allPoints,
		setAllPoints,
		setIncludedElementId,
		mapReady,
		setMapReady,
		resetTileLayerURL,
	} = useMapStore(useShallow((state) => state));
	// on récupère le state pour les filtres
	const setMapFilters = useMapAsideMenuStore((state) => state.setMapFilters);

	// on définit les states nécessaires
	const [panelDisplayed, setPanelDisplayed] = useState<boolean>(true);

	// on charge les points de la carte
	const fetchAllPoints = async () => {
		try {
			const points = await getAllPointsByMapId(mapId as string, null);
			setAllPoints(points);
			setMapReady(true);
		} catch (error) {
			console.error("Erreur lors du chargement des points:", error);
		}
	};

	// on charge les informations d'introduction de la carte
	const fetchMapInfos = async (mapId: string) => {
		try {
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
		} catch (error) {
			console.error("Erreur lors du chargement des infos de la carte:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setMapReady(false);
		setPanelDisplayed(false);
		fetchMapInfos(mapId as string);
		fetchAllPoints();
		resetTileLayerURL();
	}, [mapId]);

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
