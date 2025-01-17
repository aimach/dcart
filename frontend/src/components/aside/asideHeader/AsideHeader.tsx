// import des bibliothèques
import { useContext } from "react";
// import des composants
import NavComponent from "../../common/NavComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des types
import type { NavList } from "../../../types/commonTypes";
// import du style
import style from "./asideHeader.module.scss";

const AsideHeader = () => {
	// on importe les données de language
	const { language, translation } = useContext(TranslationContext);

	const asideNavList: NavList = [
		{
			title: translation[language].button.results,
			onClickFunction: () => console.log("coucou"),
			route: undefined,
		},
		{
			title: translation[language].button.filters,
			onClickFunction: () => console.log("coucou"),
			route: undefined,
		},
		{
			title: translation[language].button.infos,
			onClickFunction: () => console.log("coucou"),
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
