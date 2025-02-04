// import des bibliothèques
import { useState, useEffect, useContext } from "react";
// import des services
import { getAllMapsInfos } from "../../../utils/loaders/loaders";
// import des types
import type { MapType } from "../../../utils/types/mapTypes";
import { TranslationContext } from "../../../context/TranslationContext";

const BackofficeMapPage = () => {
	// on récupère la langue
	const { language } = useContext(TranslationContext);

	// on récupère les données des cartes dans la BDD
	const [allMapsInfos, setAllMapsInfos] = useState<MapType[]>([]);

	// Fonction pour charger les informations des cartes
	const fetchAllMapsInfos = async () => {
		try {
			const maps = await getAllMapsInfos();
			setAllMapsInfos(maps);
		} catch (error) {
			console.error("Erreur lors du chargement des cartes:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchAllMapsInfos();
	}, []);

	return (
		<div>
			<h2>Gestion des cartes</h2>
			<section>
				<ul>
					{allMapsInfos.map((map) => (
						<li key={map.id}>{`name_${language}`}</li>
					))}
				</ul>
			</section>
		</div>
	);
};

export default BackofficeMapPage;
