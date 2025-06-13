// import des bibliothèques
import { useContext } from "react";
import { Link } from "react-router";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des composants
import { AuthContext } from "../../../context/AuthContext";
// import du style
import style from "./BOHomePage.module.scss";
import {
	BookOpenText,
	ChartPie,
	Languages,
	MapPin,
	Tag,
	UserRound,
} from "lucide-react";

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
					<Link to="/backoffice/maps">
						<li>
							<MapPin />
							{translation[language].navigation.maps}
						</li>
					</Link>
					<Link to="/backoffice/storymaps">
						<li>
							<BookOpenText />
							{translation[language].navigation.storymaps}
						</li>
					</Link>
					{isAdmin && (
						<>
							<Link to="/backoffice/translation">
								<li>
									<Languages />
									{translation[language].navigation.translation}
								</li>
							</Link>
							<Link to="/backoffice/users">
								<li>
									<UserRound />
									{translation[language].navigation.users}
								</li>
							</Link>
							<Link to="/backoffice/tags">
								<li>
									<Tag />
									{translation[language].navigation.tags}
								</li>
							</Link>
							<Link to="/backoffice/divinities">
								<li>
									<ChartPie />
									{translation[language].navigation.divinities}
								</li>
							</Link>
						</>
					)}
				</ul>
			</nav>
		</div>
	);
};

export default BOHomePage;
