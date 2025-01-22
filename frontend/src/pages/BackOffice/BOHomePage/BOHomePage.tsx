// import des bibliothèques
import { useContext } from "react";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import du style
import style from "./BOHomePage.module.scss";
import { Link } from "react-router";
console.log(style);
const BOHomePage = () => {
	// on récupère le language
	const { language, translation } = useContext(TranslationContext);
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
