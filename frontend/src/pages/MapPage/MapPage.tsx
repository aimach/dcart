// import des bibliothèques
import { useState, useEffect } from "react";
// import des composants
import MapComponent from "../../components/mapComponent/MapComponent";
import LoaderComponent from "../../components/common/loader/LoaderComponent";
// import du style
import style from "./mapPage.module.scss";

const MapPage = () => {
	const [mapReady, setMapReady] = useState<boolean>(false);
	const [toggleButtons, setToggleButtons] = useState({
		right: true,
		left: true,
	});

	useEffect(() => {
		// on attend que les tuiles soient chargées
		setTimeout(() => setMapReady(true), 800);
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
						<MapComponent toggleButtons={toggleButtons} />
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
