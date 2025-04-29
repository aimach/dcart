// import des bibliothèques
import { Link, useLocation, useNavigate } from "react-router";
// import des composants
import NavComponent from "../common/NavComponent";
import ImageWithLink from "../common/ImageWithLink";
import ButtonComponent from "../common/button/ButtonComponent";
// import du context
import { AuthContext } from "../../context/AuthContext";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import des services
import { logoutUser } from "../../utils/api/authAPI";
import {
	getBackofficeNavigationList,
	getTranslationNavigationList,
	getVisitorNavigationList,
} from "../../utils/menu/menuListArrays";
// import des types
import { useContext, type Dispatch, type SetStateAction } from "react";
// import du style
import style from "./header.module.scss";
// import des images
import MAPLogo from "../../assets/map_logo.png";
// import des icônes
import { MenuIcon } from "lucide-react";

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
	// récupération des données de connexion
	const { token, setToken } = useContext(AuthContext);

	// récupération des données de traduction
	const { language, translation, setLanguage } = useTranslation();

	// récupération de l'url de la page en cours pour savoir si l'utilisateur est sur la page d'accueil
	const { pathname } = useLocation();

	// fonction de déconnexion de l'utilisateur
	const navigate = useNavigate();
	const handleLogoutClick = async () => {
		const isLoggedOut = await logoutUser();
		if (isLoggedOut) {
			setToken(null);
			navigate("/");
		}
	};

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
			{pathname !== "/" && !pathname.includes("backoffice") && (
				<Link to="/" className={style.headerLogo}>
					<h1>{translation[language].title as string}</h1>
				</Link>
			)}

			<div className={style.headerLastSection}>
				{token && !pathname.includes("backoffice") && (
					<Link to="/backoffice">
						{translation[language].navigation.backoffice}
					</Link>
				)}
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
				{type === "backoffice" && (
					<>
						<NavComponent
							type="route"
							navClassName={style.headerNavigationMenu}
							list={getBackofficeNavigationList(translation, language)}
							selectedElement={language}
							liClasseName={style.languageSelected}
						/>
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
					</>
				)}
				{/* {token && pathname.includes("backoffice") && (
					<ButtonComponent
						type="button"
						color="gold"
						textContent="deconnexion"
						onClickFunction={handleLogoutClick}
					/>
				)} */}
			</div>
		</header>
	);
};

export default HeaderComponent;
