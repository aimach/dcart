// import des bibliothèques
import { useContext } from "react";
import { Link, useLocation } from "react-router";
// import des composants
import NavComponent from "../common/NavComponent";
import ImageWithLink from "../common/ImageWithLink";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import des types
import type { Language } from "../../utils/types/languageTypes";
import type { NavList } from "../../utils/types/commonTypes";
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./header.module.scss";
// import des images
import MAPLogo from "../../assets/map_logo.png";
// import des icônes
import { MenuIcon } from "lucide-react";
import {
	getBackofficeNavigationList,
	getTranslationNavigationList,
	getVisitorNavigationList,
} from "../../utils/menu/menuListArrays";

interface HeaderComponentProps {
	type: "visitor" | "backoffice";
	setMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * Composant Header avec liens externes, menu de navigation et traduction
 * @param {string} type - le type de header à afficher
 * @param {function} setMenuIsOpen - la fonction pour ouvrir le menu
 * @returns ImageWithLink | NavComponent
 */
const HeaderComponent = ({ type, setMenuIsOpen }: HeaderComponentProps) => {
	// on récupère le contexte qui gère le language et on crée la fonction pour switcher
	const { language, translation, setLanguage } = useContext(TranslationContext);
	const switchLanguage = (newLanguage: Language) => {
		setLanguage(newLanguage);
	};

	// on récupère l'url en cours pour savoir si on est sur la page d'accueil
	const { pathname } = useLocation();

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
			{pathname !== "/" && (
				<NavComponent
					type="route"
					navClassName={style.headerNavMenu}
					list={
						type === "visitor"
							? getVisitorNavigationList(translation, language)
							: getBackofficeNavigationList(translation, language)
					}
					activeLinkClassName={style.headerNavMenuActive}
					notActiveLinkClassName={style.headerNavMenuNotActive}
				/>
			)}

			<div className={style.headerLastSection}>
				{type === "visitor" && (
					<>
						<NavComponent
							type="list"
							navClassName={style.headerTranslationMenu}
							list={getTranslationNavigationList(
								translation,
								language,
								switchLanguage,
							)}
							selectedElement={language}
							liClasseName={style.languageSelected}
						/>
						<MenuIcon onClick={() => setMenuIsOpen(true)} />
					</>
				)}
			</div>
		</header>
	);
};

export default HeaderComponent;
