// import des bibliothèques
import { useContext } from "react";
// import des composants
import NavComponent from "../../common/NavComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
import { MapAsideMenuContext } from "../../../context/MapAsideMenuContext";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { NavList } from "../../../types/commonTypes";
import type { MenuTabType } from "../../../types/mapTypes";
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
	const { selectedTabMenu, setSelectedTabMenu } =
		useContext(MapAsideMenuContext);

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
