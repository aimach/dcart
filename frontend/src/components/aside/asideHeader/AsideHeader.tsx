// import des bibliothèques
import { useContext } from "react";
// import des composants
import NavComponent from "../../common/NavComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
import { MapAsideMenuContext } from "../../../context/MapAsideMenuContext";
// import des types
import type { NavList } from "../../../types/commonTypes";
// import du style
import style from "./asideHeader.module.scss";

const AsideHeader = () => {
	// on importe les données de language
	const { language, translation } = useContext(TranslationContext);
	// on importe l'onglet par défaut
	const { selectedTabMenu, setSelectedTabMenu } =
		useContext(MapAsideMenuContext);

	const asideNavList: NavList = [
		{
			title: translation[language].button.results,
			onClickFunction: () => setSelectedTabMenu("results"),
			route: undefined,
		},
		{
			title: translation[language].button.filters,
			onClickFunction: () => setSelectedTabMenu("filters"),
			route: undefined,
		},
		{
			title: translation[language].button.infos,
			onClickFunction: () => setSelectedTabMenu("infos"),
			route: undefined,
		},
	];
	return (
		<NavComponent
			type="list"
			navClassName={style.asideHeader}
			list={asideNavList}
		/>
	);
};

export default AsideHeader;
