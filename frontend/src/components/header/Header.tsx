// import des bibliothèques
import { Link, useLocation, useNavigate } from "react-router";
// import des composants
import NavComponent from "../common/NavComponent";
import ImageWithLink from "../common/ImageWithLink";
// import du context
import { AuthContext } from "../../context/AuthContext";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
// import des services
import { getTranslationNavigationList } from "../../utils/menu/menuListArrays";
// import des types
import { useContext, type Dispatch, type SetStateAction } from "react";
// import du style
import style from "./header.module.scss";
// import des images
import MAPLogo from "../../assets/map_logo.png";
// import des icônes
import { Home, MenuIcon } from "lucide-react";

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
	const { token } = useContext(AuthContext);

	// récupération des données de traduction
	const { language, translation, setLanguage } = useTranslation();

	const { isMobile } = useWindowSize();

	// récupération de l'url de la page en cours pour savoir si l'utilisateur est sur la page d'accueil
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const { isAdmin } = useContext(AuthContext);
	return (
		<header className={style.header}>
			{type === "visitor" ? (
				isMobile && pathname !== "/" ? (
					<Link to="/">
						<Home />
					</Link>
				) : (
					<ImageWithLink
						type="link"
						link={"https://map-polytheisms.huma-num.fr/"}
						ariaLabel={"Visiter le site MAP"}
						buttonClassName={style.headerLogo}
						imgSrc={MAPLogo}
						imgAlt={"MAP logo"}
						imgWidth={50}
					/>
				)
			) : (
				<button
					type="button"
					onClick={() => navigate("/")}
					className={style.headerBackButton}
				>
					{translation[language].navigation.website}
				</button>
			)}
			{pathname !== "/" && !pathname.includes("backoffice") && !isMobile && (
				<Link to="/" className={style.headerLogo}>
					<h1>DCART - {translation[language].title as string}</h1>
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
						{pathname !== "/backoffice" && (
							<ul className={style.headerBackofficeMenu}>
								<Link to="/backoffice">
									<li>{translation[language].navigation.backoffice}</li>
								</Link>
								<Link to="/backoffice/maps">
									<li>{translation[language].navigation.maps}</li>
								</Link>
								<Link to="/backoffice/storymaps">
									<li>{translation[language].navigation.storymaps}</li>
								</Link>
								{isAdmin && (
									<>
										<Link to="/backoffice/translation">
											<li>{translation[language].navigation.translation}</li>
										</Link>
										<Link to="/backoffice/users">
											<li>{translation[language].navigation.users}</li>
										</Link>
										<Link to="/backoffice/tags">
											<li>{translation[language].navigation.tags}</li>
										</Link>
										<Link to="/backoffice/divinities">
											<li>{translation[language].navigation.divinities}</li>
										</Link>
									</>
								)}
							</ul>
						)}
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
			</div>
		</header>
	);
};

export default HeaderComponent;
