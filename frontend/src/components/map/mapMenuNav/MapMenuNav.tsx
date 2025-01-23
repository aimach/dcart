import { useState, useEffect, useContext } from "react";
// import des composants
import NavComponent from "../../common/NavComponent";
// import des services
import { getAllMapsInfos } from "../../../utils/loaders/loaders";
// import des types
import type { MapType } from "../../../types/mapTypes";
import type { NavList } from "../../../types/commonTypes";
// import du style
import style from "./mapMenuNav.module.scss";
import { TranslationContext } from "../../../context/TranslationContext";

const MapMenuNav = () => {
	// on récupère la langue
	const { language } = useContext(TranslationContext);

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

	// Met à jour la liste des cartes dès que allMapsInfos change
	useEffect(() => {
		if (allMapsInfos.length > 0) {
			const mappedList = allMapsInfos.map((map) => ({
				id: map.id,
				title: map[`name_${language}`],
				onClickFunction: undefined, // Ajoutez une fonction ici si nécessaire
				route: `/map/${map.id}`,
			}));
			setThematicMapsList(mappedList);
		}
	}, [allMapsInfos, language]);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchAllMapsInfos();
	}, []);

	return (
		<NavComponent
			type="route"
			navClassName={style.mapMenuNav}
			list={thematicMapsList}
			activeLinkClassName={style.mapMenuNavActive}
		/>
	);
};

export default MapMenuNav;
