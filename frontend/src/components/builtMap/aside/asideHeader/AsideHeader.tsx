// import des bibliothèques
// import des composants
import NavComponent from "../../../common/NavComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useShallow } from "zustand/shallow";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { getAsideNavigationList } from "../../../../utils/menu/menuListArrays";
// import du style
import style from "./asideHeader.module.scss";

/**
 * Affiche les onglets de navigation du panel latéral
 * @returns NavComponent
 */
const AsideHeader = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { selectedTabMenu, setSelectedTabMenu } = useMapAsideMenuStore(
		useShallow((state) => ({
			selectedTabMenu: state.selectedTabMenu,
			setSelectedTabMenu: state.setSelectedTabMenu,
		})),
	);
	const { mapInfos, allPoints, allResults } = useMapStore();

	return (
		<NavComponent
			aria-label="Onglets de navigation du panel latéral"
			type="list"
			navClassName={style.asideHeader}
			list={getAsideNavigationList(
				translation,
				language,
				allPoints,
				allResults,
				setSelectedTabMenu,
				mapInfos,
			)}
			selectedElement={selectedTabMenu}
			liClasseName={style.liActive}
		/>
	);
};

export default AsideHeader;
