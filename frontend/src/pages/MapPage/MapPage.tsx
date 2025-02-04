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
import {
	getAllPointsByMapId,
	getOneMapInfos,
} from "../../utils/loaders/loaders";
// import des types
import type { PointType } from "../../utils/types/mapTypes";
// import du style
import style from "./mapPage.module.scss";

const MapPage = () => {
	// on récupère les params
	const { categoryId, mapId } = useParams();

	// on récupère le state pour l'includedElement
	const { setIncludedElementId } = useContext(MapContext);

	// on définit les states nécessaires
	const [mapReady, setMapReady] = useState<boolean>(false);
	const [panelDisplayed, setPanelDisplayed] = useState<boolean>(true);
	const [mapInfos, setMapInfos] = useState(null);
	const [allPoints, setAllPoints] = useState<PointType[]>([]);

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
			setIncludedElementId(mapInfos.includedElements);
			setMapInfos(mapInfos);
		} catch (error) {
			console.error("Erreur lors du chargement des infos de la carte:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setMapReady(false);
		setPanelDisplayed(false);
		fetchAllPoints();
		fetchMapInfos(mapId as string);
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
					/>
				) : (
					<AsideReducedMenuComponent setPanelDisplayed={setPanelDisplayed} />
				)}

				<section className={mapReady ? undefined : style.mapSectionLoaded}>
					<MapComponent
						setPanelDisplayed={setPanelDisplayed}
						points={allPoints}
						setAllPoints={setAllPoints}
						mapReady={mapReady}
						mapInfos={mapInfos}
						mapId={mapId as string}
					/>
				</section>
			</section>
		</section>
	);
};

export default MapPage;
