// import des bibliothèques
import { useContext, useState } from "react";
// import des composants
import NavComponent from "../../common/NavComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { useShallow } from "zustand/shallow";
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
// import des types
import type { NavList } from "../../../utils/types/commonTypes";
// import du style
import style from "./asideHeader.module.scss";
import { useMapStore } from "../../../utils/stores/mapStore";

const AsideHeader = () => {
	// on importe les données de language
	const { language, translation } = useContext(TranslationContext);
	// on importe l'onglet par défaut
	const { selectedTabMenu, setSelectedTabMenu } = useMapAsideMenuStore(
		useShallow((state) => ({
			selectedTabMenu: state.selectedTabMenu,
			setSelectedTabMenu: state.setSelectedTabMenu,
		})),
	);
	// on récupère des données de la carte
	const allPoints = useMapStore((state) => state.allPoints);

	const asideNavList: NavList = [
		{
			id: "results",
			title: `${allPoints.length} ${translation[language].button.results}`,
			onClickFunction: () => setSelectedTabMenu("results"),
			route: undefined,
		},
		{
			id: "filters",
			title: translation[language].button.filters,
			onClickFunction: () => setSelectedTabMenu("filters"),
			route: undefined,
		},
		{
			id: "infos",
			title: translation[language].button.selection,
			onClickFunction: () => setSelectedTabMenu("infos"),
			route: undefined,
		},
	];

	return (
		<NavComponent
			type="list"
			navClassName={style.asideHeader}
			list={asideNavList}
			selectedElement={selectedTabMenu}
			liClasseName={style.liActive}
		/>
	);
};

export default AsideHeader;
