// import des bibliothèques
import { useState, useEffect, useContext } from "react";
// import des composants
import ButtonComponent from "../../../components/common/button/ButtonComponent";
// import des services
import { getAllMapsInfos } from "../../../utils/api/getRequests";
// import des types
import type { MapType } from "../../../utils/types/mapTypes";
import { TranslationContext } from "../../../context/TranslationContext";
// import du style
import style from "./backofficeMapPage.module.scss";

const BackofficeMapPage = () => {
	// on récupère la langue
	const { language } = useContext(TranslationContext);

	// on récupère les données des cartes dans la BDD
	const [allMapsInfos, setAllMapsInfos] = useState<MapType[]>([]);

	useEffect(() => {
		// Fonction pour charger les informations des cartes
		const fetchAllMapsInfos = async () => {
			const maps = await getAllMapsInfos();
			setAllMapsInfos(maps);
		};
		fetchAllMapsInfos();
	}, []);

	return (
		<section className={style.backofficeMapPageContainer}>
			<h2>Gestion des cartes</h2>
			<ButtonComponent
				type="route"
				color="gold"
				textContent="Créer une carte"
				link="/backoffice/maps/create"
			/>
			<section className={style.mapList}>
				Liste des cartes :
				<ul>
					{allMapsInfos.map((map) => (
						<li key={map.id}>{map[`name_${language}`]}</li>
					))}
				</ul>
			</section>
		</section>
	);
};

export default BackofficeMapPage;
