import { useState, useEffect, useContext } from "react";
// import des composants
import NavComponent from "../../common/NavComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { getAllMapsInfosFromCategoryId } from "../../../utils/loaders/loaders";
// import des types
import type { MapType } from "../../../types/mapTypes";
import type { NavList } from "../../../types/commonTypes";
// import du style
import style from "./mapMenuNav.module.scss";

interface MapMenuNavProps {
	categoryId: string;
}

const MapMenuNav = ({ categoryId }: MapMenuNavProps) => {
	// on récupère les données de language
	const { language } = useContext(TranslationContext);

	// on récupère les données des cartes dans la BDD
	const [allMapsFromCategoryId, setAllMapsFromCategoryId] = useState<MapType[]>(
		[],
	);
	const [mapList, setMapList] = useState<NavList>([]);

	// Fonction pour charger les informations des cartes
	const fetchAllMapsInfosFromCategory = async () => {
		try {
			const categoryWithMaps = await getAllMapsInfosFromCategoryId(
				categoryId as string,
			);
			setAllMapsFromCategoryId(categoryWithMaps.maps);
		} catch (error) {
			console.error("Erreur lors du chargement des cartes:", error);
		}
	};

	// Met à jour la liste des cartes dès que allMapsInfos change
	useEffect(() => {
		if (allMapsFromCategoryId.length > 0) {
			const mapList = allMapsFromCategoryId.map((map) => ({
				id: map.id,
				title: map[`name_${language}`],
				onClickFunction: undefined, // Ajoutez une fonction ici si nécessaire
				route: `map/${map.id}`,
			}));
			setMapList(mapList);
		}
	}, [allMapsFromCategoryId, language]);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchAllMapsInfosFromCategory();
	}, []);

	return (
		<NavComponent
			type="route"
			navClassName={style.mapMenuNav}
			list={mapList}
			activeLinkClassName={style.mapMenuNavActive}
		/>
	);
};

export default MapMenuNav;
