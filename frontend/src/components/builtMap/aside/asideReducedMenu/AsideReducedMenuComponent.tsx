// import des composants
import NavComponent from "../../../common/NavComponent";
// import des services
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { NavList } from "../../../../utils/types/commonTypes";
import type { MenuTabType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./asideReducedMenuComponent.module.scss";
// import des icones
import { CircleHelp, Filter, ListCollapse, MapPin } from "lucide-react";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";

interface AsideReducedMenuComponentProps {
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
}

/**
 * Affiche le panel latéral en version réduite, avec le lien vers les onglets
 * @param {Object} props
 * @param {Dispatch<SetStateAction<boolean>>} props.setPanelDisplayed - Modifie l'état d'affichage du panel latéral
 * @returns NavComponent
 */
const AsideReducedMenuComponent = ({
	setPanelDisplayed,
}: AsideReducedMenuComponentProps) => {
	// récupération des données des stores
	const setSelectedTabMenu = useMapAsideMenuStore(
		(state) => state.setSelectedTabMenu,
	);
	const { openTutorial } = useMapStore();

	const openMenuOnSelectedTab = (tab: MenuTabType) => {
		setSelectedTabMenu(tab);
		setPanelDisplayed(true);
	};

	const reducedAsideNavList: NavList = [
		{
			id: "results",
			title: <ListCollapse />,
			onClickFunction: () => openMenuOnSelectedTab("results"),
			route: undefined,
		},
		{
			id: "filters",
			title: <Filter />,
			onClickFunction: () => openMenuOnSelectedTab("filters"),
			route: undefined,
		},
		{
			id: "infos",
			title: <MapPin />,
			onClickFunction: () => openMenuOnSelectedTab("infos"),
			route: undefined,
		},
		{
			id: "tuto",
			title: <CircleHelp />,
			onClickFunction: () => openTutorial(),
			route: undefined,
		},
	];
	return (
		<NavComponent
			type="list"
			navClassName={style.reducedAsideNav}
			list={reducedAsideNavList}
		/>
	);
};

export default AsideReducedMenuComponent;
