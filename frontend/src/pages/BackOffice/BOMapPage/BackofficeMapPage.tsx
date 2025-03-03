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
	// Import des hooks (useState, useEffect, etc.
	const [allMapsInfos, setAllMapsInfos] = useState<MapType[]>([]);
	// Récupération des données externes (context, store, params, etc.)
	// on récupère la langue
	const { language } = useTranslation();
	// Déclaration des constantes (ex : URLs, variables non réactives)
	// Déclaration des fonctions internes
	// Effets secondaires (useEffect, useMemo, useCallback)
	// Retour du JSX

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
