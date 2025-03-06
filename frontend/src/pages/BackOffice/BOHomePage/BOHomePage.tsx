// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import du style
import style from "./BOHomePage.module.scss";
import { Link } from "react-router";

/**
 * Page d'accueil du backoffice avec liens vers toutes les pages
 */
const BOHomePage = () => {
	// récupération des données de la langue
	const { language, translation } = useTranslation();
	return (
		<div className={style.homeNavContainer}>
			<nav className={style.homeNav}>
				<ul>
					<li>
						<Link to="/backoffice/maps">
							{translation[language].navigation.maps}
						</Link>
					</li>
					<li>
						<Link to="/backoffice/storymaps">
							{translation[language].navigation.storymaps}
						</Link>
					</li>
					<li>
						<Link to="/backoffice/translation">
							{translation[language].navigation.translation}
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default BOHomePage;
