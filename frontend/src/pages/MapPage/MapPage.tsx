// import des bibliothèques
import { useState, useEffect } from "react";
import { useParams } from "react-router";
// import des composants
import MapComponent from "../../components/mapComponent/MapComponent";
import LoaderComponent from "../../components/common/loader/LoaderComponent";
// import des services
import { getAllPointsByMapId } from "../../utils/loaders/loaders";
// import du style
import style from "./mapPage.module.scss";

const MapPage = () => {
	// on récupère les params
	const { mapId } = useParams();

	// on définit les states nécessaires
	const [mapReady, setMapReady] = useState<boolean>(false);
	const [toggleButtons, setToggleButtons] = useState({
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
				<aside
					className={
						toggleButtons.left ? `${style.asideOpened}` : `${style.asideClosed}`
					}
				>
					Résultats
					<div className={style.toggleButtonContainer}>
						<button
							type="button"
							className={`${style.toggleButtonLeft} ${style.toggleButton}`}
							onClick={() =>
								setToggleButtons({
									...toggleButtons,
									left: !toggleButtons.left,
								})
							}
						>
							{toggleButtons.left ? "<" : ">"}
						</button>
					</div>
				</aside>
				<section className={mapReady ? undefined : style.mapSectionLoaded}>
					{mapReady ? (
						<MapComponent toggleButtons={toggleButtons} points={allPoints} />
					) : (
						<LoaderComponent />
					)}
				</section>
				<aside
					className={
						toggleButtons.right
							? `${style.asideOpened}`
							: `${style.asideClosed}`
					}
				>
					Filtres
					<div className={style.toggleButtonContainer}>
						<button
							type="button"
							className={`${style.toggleButtonRight} ${style.toggleButton}`}
							onClick={() =>
								setToggleButtons({
									...toggleButtons,
									right: !toggleButtons.right,
								})
							}
						>
							{toggleButtons.right ? ">" : "<"}
						</button>
					</div>
				</aside>
			</section>
		</section>
	);
};

export default MapPage;
