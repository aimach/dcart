// import des bibliothèques
import { useContext } from "react";
// import des composants
import NavComponent from "../common/NavComponent";
import ButtonWithLink from "../common/ButtonWithLink";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import des types
import type { Language } from "../../types/languageTypes";
import type { NavList } from "../../types/commonTypes";
// import du style
import style from "./header.module.scss";
// import des images
import MAPLogo from "../../../public/map_logo.png";

const HeaderComponent = () => {
	// on récupère le contexte qui gère le language et on crée la fonction pour switcher
	const { language, translation, setLanguage } = useContext(TranslationContext);
	const switchLanguage = (newLanguage: Language) => {
		setLanguage(newLanguage);
	};

	const pageNavigationList: NavList = [
		{
			title: "Page 1",
			onClickFunction: undefined,
		},
		{
			title: "Page 2",
			onClickFunction: undefined,
		},
		{
			title: "Page 3",
			onClickFunction: undefined,
		},
	];

	const translationNavigationList: NavList = [
		{
			title: translation[language].fr,
			onClickFunction: () => switchLanguage("fr"),
		},
		{
			title: translation[language].en,
			onClickFunction: () => switchLanguage("en"),
		},
	];

	return (
		<header className={style.header}>
			<ButtonWithLink
				link={"https://map-polytheisms.huma-num.fr/"}
				ariaLabel={"Visiter le site MAP"}
				buttonClassName={style.headerLogo}
				imgSrc={MAPLogo}
				imgAlt={"MAP logo"}
				imgWidth={100}
			/>
			<NavComponent
				navClassName={style.headerNavMenu}
				list={pageNavigationList}
			/>
			<NavComponent
				navClassName={style.headerTranslationMenu}
				list={translationNavigationList}
			/>
		</header>
	);
};

export default HeaderComponent;
