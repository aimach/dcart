// import des bibliothèques
import { useState, useEffect } from "react";
// import des composants
import ButtonComponent from "../../../components/common/button/ButtonComponent";
// import des hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { getAllMapsInfos } from "../../../utils/api/getRequests";
// import des types
import type { MapType } from "../../../utils/types/mapTypes";
// import du style
import style from "./backofficeMapPage.module.scss";

/**
 * Page du backoffice pour la gestion des cartes (création, modification, suppression)
 * @returns ButtonComponent
 */
const BackofficeMapPage = () => {
	// récupération des données de la langue
	const { language } = useTranslation();

	// état pour stocker les informations des cartes
	const [allMapsInfos, setAllMapsInfos] = useState<MapType[]>([]);

	// chargement des informations des cartes au montage du composant
	useEffect(() => {
		// fonction pour charger les informations des cartes
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
