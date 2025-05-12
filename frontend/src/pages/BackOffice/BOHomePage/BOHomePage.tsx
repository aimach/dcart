// import des bibliothèques
import { useContext } from "react";
import { Link } from "react-router";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des composants
import { AuthContext } from "../../../context/AuthContext";
// import du style
import style from "./BOHomePage.module.scss";

/**
 * Page d'accueil du backoffice avec liens vers toutes les pages
 */
const BOHomePage = () => {
	// récupération des données de la langue
	const { language, translation } = useTranslation();

	const { isAdmin } = useContext(AuthContext);
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
					{isAdmin && (
						<>
							<li>
								<Link to="/backoffice/translation">
									{translation[language].navigation.translation}
								</Link>
							</li>
							<li>
								<Link to="/backoffice/users">
									{translation[language].navigation.users}
								</Link>
							</li>
							<li>
								<Link to="/backoffice/tags">
									{translation[language].navigation.tags}
								</Link>
							</li>
							<li>
								<Link to="/backoffice/divinities">
									{translation[language].navigation.divinities}
								</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
		</div>
	);
};

export default BOHomePage;
