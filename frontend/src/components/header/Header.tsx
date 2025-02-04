// import des bibliothèques
import { useContext } from "react";
import { Link } from "react-router";
// import des composants
import NavComponent from "../common/NavComponent";
import ImageWithLink from "../common/ImageWithLink";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import des types
import type { Language } from "../../utils/types/languageTypes";
import type { NavList } from "../../utils/types/commonTypes";
// import du style
import style from "./header.module.scss";
// import des images
import MAPLogo from "../../../public/map_logo.png";

interface HeaderComponentProps {
	type: "visitor" | "backoffice";
}

const HeaderComponent = ({ type }: HeaderComponentProps) => {
	// on récupère le contexte qui gère le language et on crée la fonction pour switcher
	const { language, translation, setLanguage } = useContext(TranslationContext);
	const switchLanguage = (newLanguage: Language) => {
		setLanguage(newLanguage);
	};

	const visitorNavigationList: NavList = [
		{
			id: "home",
			title: translation[language].navigation.home,
			onClickFunction: undefined,
			route: "/",
		},
		{
			id: "maps",
			title: translation[language].navigation.maps,
			onClickFunction: undefined,
			route: "maps/categories",
		},
		{
			id: "undefined",
			title: translation[language].navigation.storymaps,
			onClickFunction: undefined,
			route: "/storymaps",
		},
	];

	const backofficeNavigationList: NavList = [
		{
			id: "home",
			title: translation[language].navigation.backoffice,
			onClickFunction: undefined,
			route: "/backoffice",
		},
		{
			id: "maps",
			title: translation[language].navigation.maps,
			onClickFunction: undefined,
			route: "/backoffice/maps",
		},
		{
			id: "storymaps",
			title: translation[language].navigation.storymaps,
			onClickFunction: undefined,
			route: "/backoffice/storymaps",
		},
		{
			id: "translation",
			title: translation[language].navigation.translation,
			onClickFunction: undefined,
			route: "/backoffice/translation",
		},
	];

	const translationNavigationList: NavList = [
		{
			id: "fr",
			title: translation[language].fr,
			onClickFunction: () => switchLanguage("fr"),
			route: undefined,
		},
		{
			id: "en",
			title: translation[language].en,
			onClickFunction: () => switchLanguage("en"),
			route: undefined,
		},
	];

	return (
		<header className={style.header}>
			{type === "visitor" ? (
				<ImageWithLink
					type="link"
					link={"https://map-polytheisms.huma-num.fr/"}
					ariaLabel={"Visiter le site MAP"}
					buttonClassName={style.headerLogo}
					imgSrc={MAPLogo}
					imgAlt={"MAP logo"}
					imgWidth={50}
				/>
			) : (
				<Link to="/">{translation[language].navigation.back}</Link>
			)}

			<NavComponent
				type="route"
				navClassName={style.headerNavMenu}
				list={
					type === "visitor" ? visitorNavigationList : backofficeNavigationList
				}
				activeLinkClassName={style.headerNavMenuActive}
			/>
			<div className={style.headerLastSection}>
				{type === "visitor" && (
					<>
						<NavComponent
							type="list"
							navClassName={style.headerTranslationMenu}
							list={translationNavigationList}
							selectedElement={language}
							liClasseName={style.languageSelected}
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
					</>
				)}
			</div>
		</header>
	);
};

export default HeaderComponent;
