// import des bibliothèques
// import des composants
import NavComponent from "../../../common/NavComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useShallow } from "zustand/shallow";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import du style
import style from "./asideHeader.module.scss";
import { getAsideNavigationList } from "../../../../utils/menu/menuListArrays";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";

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
	const allPoints = useMapStore((state) => state.allPoints);
	const { userFilters } = useMapFiltersStore();

	return (
		<NavComponent
			type="list"
			navClassName={style.asideHeader}
			list={getAsideNavigationList(
				translation,
				language,
				allPoints,
				setSelectedTabMenu,
				userFilters,
			)}
			selectedElement={selectedTabMenu}
			liClasseName={style.liActive}
		/>
	);
};

export default AsideHeader;
