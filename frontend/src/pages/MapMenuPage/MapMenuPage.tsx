// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
// import des composants
import NavComponent from "../../components/common/NavComponent";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import des services
import { getAllMapsInfos } from "../../utils/loaders/loaders";
// import des types
import type { NavList } from "../../types/commonTypes";
import type { MapType } from "../../types/mapTypes";
// import du style
import style from "./mapMenuPage.module.scss";

const MapMenuPage = () => {
	// on récupère le language
	const { language, translation } = useContext(TranslationContext);

	// on récupère les données des cartes dans la BDD
	const [allMapsInfos, setAllMapsInfos] = useState<MapType[]>([]);
	const [thematicMapsList, setThematicMapsList] = useState<NavList>([]);

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

	// Met à jour la liste des cartes dès que allMapsInfos change
	useEffect(() => {
		if (allMapsInfos.length > 0) {
			const mappedList = allMapsInfos.map((map) => ({
				title: map.name,
				onClickFunction: undefined, // Ajoutez une fonction ici si nécessaire
				route: `/map/${map.id}`,
			}));
			setThematicMapsList(mappedList);
		}
	}, [allMapsInfos]);

	return (
		<section className={style.mapMenu}>
			<div className={style.mapMenuButtonContainer}>
				<Link to="exploration" className={style.mapMenuActionButton}>
					{translation[language].button.freeExploration as string}
				</Link>
			</div>
			<div className={style.mapMenuNavContainer}>
				<NavComponent
					type="route"
					navClassName={style.mapMenuNav}
					list={thematicMapsList}
				/>
			</div>
		</section>
	);
};

export default MapMenuPage;
