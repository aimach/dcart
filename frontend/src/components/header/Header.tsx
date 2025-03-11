// import des bibliothèques
import { Link, useLocation } from "react-router";
// import des composants
import NavComponent from "../common/NavComponent";
import ImageWithLink from "../common/ImageWithLink";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import des types
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
	// récupération des données de traduction
	const { language, translation, setLanguage } = useTranslation();

	// récupération de l'url de la page en cours pour savoir si l'utilisateur est sur la page d'accueil
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
								setLanguage,
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
