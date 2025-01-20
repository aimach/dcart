// import des bibliothèques
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
// import des composants
import MapComponent from "../../components/map/mapComponent/MapComponent";
import AsideContainer from "../../components/aside/asideContainer/AsideContainer";
import AsideReducedMenuComponent from "../../components/aside/asideReducedMenu/AsideReducedMenuComponent";
import MapMenuNav from "../../components/map/mapMenuNav/MapMenuNav";
// import du context
import { MapContext } from "../../context/MapContext";
// import des services
import { getAllPointsByMapId } from "../../utils/loaders/loaders";
// import des types
import type { PointType } from "../../types/mapTypes";
import type { Map as LeafletMap } from "leaflet";
// import du style
import style from "./mapPage.module.scss";

const MapPage = () => {
	// on récupère les params
	const { mapId } = useParams();

	// on récupère le context
	const { map, setMap, selectedMarker, setSelectedMarker } =
		useContext(MapContext);

	// on définit les states nécessaires
	const [mapReady, setMapReady] = useState<boolean>(false);
	const [panelDisplayed, setPanelDisplayed] = useState<boolean>(true);
	const [allPoints, setAllPoints] = useState<PointType[]>([]);

	// on charge les points de la carte
	const fetchAllPoints = async () => {
		try {
			const points = await getAllPointsByMapId(mapId as string);
			setAllPoints(points);
			setMapReady(true);
		} catch (error) {
			console.error("Erreur lors du chargement des points:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setMapReady(false);
		setPanelDisplayed(false);
		fetchAllPoints();
	}, [mapId]);

	return (
		<section className={style.mapSection}>
			<MapMenuNav />
			<section className={style.mapSectionMain}>
				{panelDisplayed ? (
					<AsideContainer
						panelDisplayed={panelDisplayed}
						setPanelDisplayed={setPanelDisplayed}
						allPoints={allPoints}
					/>
				) : (
					<AsideReducedMenuComponent setPanelDisplayed={setPanelDisplayed} />
				)}

				<section className={mapReady ? undefined : style.mapSectionLoaded}>
					<MapComponent
						setPanelDisplayed={setPanelDisplayed}
						points={allPoints}
						map={map as LeafletMap}
						setMap={setMap}
						mapReady={mapReady}
					/>
				</section>
			</section>
		</section>
	);
};

export default MapPage;
