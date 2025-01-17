// import des bibliothèques
import { useState, useEffect } from "react";
import { useParams } from "react-router";
// import des composants
import MapComponent from "../../components/mapComponent/MapComponent";
import AsideContainer from "../../components/aside/asideContainer/AsideContainer";
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

	// on définit les states nécessaires
	const [map, setMap] = useState<LeafletMap | null>(null);

	const [mapReady, setMapReady] = useState<boolean>(false);
	const [toggleButtons, setToggleButtons] = useState<
		Partial<{ right: boolean; left: boolean }>
	>({
		right: false,
		left: true,
	});
	const [allPoints, setAllPoints] = useState<PointType[]>([]);
	const [selectedPoint, setSelectedPoint] = useState<PointType | null>(null);

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
		fetchAllPoints();
	}, []);

	return (
		<section className={style.mapSection}>
			<header className={style.mapSectionHeader}>Menu</header>
			<section className={style.mapSectionMain}>
				<AsideContainer
					side="left"
					toggleButtons={toggleButtons}
					setToggleButtons={setToggleButtons}
					selectedPoint={selectedPoint}
					allPoints={allPoints}
				/>
				<section className={mapReady ? undefined : style.mapSectionLoaded}>
					<MapComponent
						toggleButtons={toggleButtons}
						setToggleButtons={setToggleButtons}
						points={allPoints}
						selectedPoint={selectedPoint as PointType}
						setSelectedPoint={setSelectedPoint}
						map={map as LeafletMap}
						setMap={setMap}
						mapReady={mapReady}
					/>
				</section>
				<AsideContainer
					side="right"
					toggleButtons={toggleButtons}
					setToggleButtons={setToggleButtons}
				/>
			</section>
		</section>
	);
};

export default MapPage;
