// import des bibliothèques
import { useState, useEffect } from "react";
// import des composants
import MapComponent from "../../components/mapComponent/MapComponent";
// import du style
import style from "./mapPage.module.scss";
import LoaderComponent from "../../components/common/loader/LoaderComponent";

const MapPage = () => {
	const [mapReady, setMapReady] = useState<boolean>(false);

	useEffect(() => {
		// on attend que les tuiles soient chargées
		setTimeout(() => setMapReady(true), 800);
	}, []);

	return (
		<section className={style.mapSection}>
			<header className={style.mapSectionHeader}>Menu</header>
			<section className={style.mapSectionMain}>
				<aside>Résultats</aside>
				<section className={mapReady ? undefined : style.mapSectionLoaded}>
					{mapReady ? <MapComponent /> : <LoaderComponent />}
				</section>
				<aside>Filtres</aside>
			</section>
		</section>
	);
};

export default MapPage;
