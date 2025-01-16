// import des bibliothèques
import { useState, useEffect } from "react";
import { useParams } from "react-router";
// import des composants
import MapComponent from "../../components/mapComponent/MapComponent";
import LoaderComponent from "../../components/common/loader/LoaderComponent";
import AsideComponent from "../../components/asideComponent.tsx/AsideComponent";
// import des services
import { getAllPointsByMapId } from "../../utils/loaders/loaders";
// import du style
import style from "./mapPage.module.scss";

const MapPage = () => {
	// on récupère les params
	const { mapId } = useParams();

	// on définit les states nécessaires
	const [mapReady, setMapReady] = useState<boolean>(false);
	const [toggleButtons, setToggleButtons] = useState<
		Partial<{ right: boolean; left: boolean }>
	>({
		right: false,
		left: false,
	});
	const [allPoints, setAllPoints] = useState([]);

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
				<AsideComponent
					side="left"
					toggleButtons={toggleButtons}
					setToggleButtons={setToggleButtons}
				/>
				<section className={mapReady ? undefined : style.mapSectionLoaded}>
					{mapReady ? (
						<MapComponent
							toggleButtons={toggleButtons}
							setToggleButtons={setToggleButtons}
							points={allPoints}
						/>
					) : (
						<LoaderComponent />
					)}
				</section>
				<AsideComponent
					side="right"
					toggleButtons={toggleButtons}
					setToggleButtons={setToggleButtons}
				/>
			</section>
		</section>
	);
};

export default MapPage;
