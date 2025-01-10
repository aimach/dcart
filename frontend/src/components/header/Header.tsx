// import des bibliothèques
import { useContext } from "react";
// import des composants
import NavComponent from "../common/NavComponent";
import ImageWithLink from "../common/ImageWithLink";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import des types
import type { Language, TranslationObject } from "../../types/languageTypes";
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
			title: (
				(translation[language] as TranslationObject)
					.navigation as TranslationObject
			).home,
			onClickFunction: undefined,
			route: "/",
		},
		{
			title: (
				(translation[language] as TranslationObject)
					.navigation as TranslationObject
			).map,
			onClickFunction: undefined,
			route: "/map",
		},
		{
			title: "Page 3",
			onClickFunction: undefined,
			route: "/",
		},
	];

	const translationNavigationList: NavList = [
		{
			title: (translation[language] as TranslationObject).fr,
			onClickFunction: () => switchLanguage("fr"),
			route: undefined,
		},
		{
			title: (translation[language] as TranslationObject).en,
			onClickFunction: () => switchLanguage("en"),
			route: undefined,
		},
	];

	return (
		<header className={style.header}>
			<ImageWithLink
				type="link"
				link={"https://map-polytheisms.huma-num.fr/"}
				ariaLabel={"Visiter le site MAP"}
				buttonClassName={style.headerLogo}
				imgSrc={MAPLogo}
				imgAlt={"MAP logo"}
				imgWidth={100}
			/>
			<NavComponent
				type="route"
				navClassName={style.headerNavMenu}
				list={pageNavigationList}
			/>
			<div className={style.headerLastSection}>
				<NavComponent
					type="list"
					navClassName={style.headerTranslationMenu}
					list={translationNavigationList}
				/>
				<ImageWithLink
					type="route"
					link={"/menu"}
					ariaLabel={undefined}
					buttonClassName={undefined}
					imgSrc={""}
					imgAlt={"Menu"}
					imgWidth={100}
				/>
			</div>
		</header>
	);
};

export default HeaderComponent;
