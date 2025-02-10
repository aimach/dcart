// import des bibliothèques
import { useContext } from "react";
// import des composants
import NavComponent from "../../common/NavComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { NavList } from "../../../utils/types/commonTypes";
import type { MenuTabType } from "../../../utils/types/mapTypes";
// import du style
import style from "./asideReducedMenuComponent.module.scss";

interface AsideReducedMenuComponentProps {
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
}

const AsideReducedMenuComponent = ({
	setPanelDisplayed,
}: AsideReducedMenuComponentProps) => {
	// on importe les données de language
	const { language, translation } = useContext(TranslationContext);
	// on importe l'onglet par défaut
	const setSelectedTabMenu = useMapAsideMenuStore(
		(state) => state.setSelectedTabMenu,
	);

	const openMenuOnSelectedTab = (tab: MenuTabType) => {
		setSelectedTabMenu(tab);
		setPanelDisplayed(true);
	};

	const reducedAsideNavList: NavList = [
		{
			id: "results",
			title: translation[language].button.results,
			onClickFunction: () => openMenuOnSelectedTab("results"),
			route: undefined,
		},
		{
			id: "filters",
			title: translation[language].button.filters,
			onClickFunction: () => openMenuOnSelectedTab("filters"),
			route: undefined,
		},
		{
			id: "infos",
			title: translation[language].button.infos,
			onClickFunction: () => openMenuOnSelectedTab("infos"),
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
