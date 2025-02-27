// import des bibliothèques
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
// import des composants
import MapMenuNav from "../../components/map/mapMenuNav/MapMenuNav";
import TitleAndTextComponent from "../../components/common/titleAndText/TitleAndTextComponent";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import des services
import { getAllMapsInfosFromCategoryId } from "../../utils/api/getRequests";
// import des types
import type { CategoryType, MapType } from "../../utils/types/mapTypes";
import type { NavList } from "../../utils/types/commonTypes";
// import du style
import style from "./mapMenuPage.module.scss";

const MapMenuPage = () => {
	const { categoryId } = useParams();

	// on récupère les données de language
	const { language } = useContext(TranslationContext);

	// on récupère les données des cartes dans la BDD
	const [categoryInfos, setCategoryInfos] = useState<CategoryType>();
	const [allMapsFromCategoryId, setAllMapsFromCategoryId] = useState<MapType[]>(
		[],
	);
	const [mapList, setMapList] = useState<NavList>([]);

	// Fonction pour charger les informations des cartes
	const fetchAllMapsInfosFromCategory = async () => {
		const categoryWithMaps = await getAllMapsInfosFromCategoryId(
			categoryId as string,
		);
		setAllMapsFromCategoryId(categoryWithMaps.maps);
		setCategoryInfos(categoryWithMaps);
	};

	// Met à jour la liste des cartes dès que allMapsInfos change
	useEffect(() => {
		if (allMapsFromCategoryId.length > 0) {
			const mapList = allMapsFromCategoryId.map((map) => ({
				id: map.id,
				title: map[`name_${language}`],
				description: map[`description_${language}`],
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
		categoryInfos && (
			<section className={style.mapMenu}>
				<div className={style.mapMenuContainer}>
					<TitleAndTextComponent
						title={categoryInfos[`name_${language}`]}
						text={categoryInfos[`description_${language}`] as string}
					/>
				</div>
				<div className={style.mapMenuNavContainer}>
					<MapMenuNav mapList={mapList} />
				</div>
			</section>
		)
	);
};

export default MapMenuPage;
