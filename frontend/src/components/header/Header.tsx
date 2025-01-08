// import des bibliothèques
import { useContext } from "react";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import des types
import type { Language } from "../../types/languageTypes";
// import du style
import "./header.module.scss";

const HeaderComponent = () => {
	// on récupère le contexte qui gère le language et on crée la fonction pour switcher
	const { language, translation, setLanguage } = useContext(TranslationContext);
	const switchLanguage = (newLanguage: Language) => {
		setLanguage(newLanguage);
	};

	return (
		<header>
			<nav>
				<ul>
					<li
						onClick={() => switchLanguage("fr")}
						onKeyUp={() => switchLanguage("fr")}
					>
						{translation[language].fr}
					</li>
					<li
						onClick={() => switchLanguage("en")}
						onKeyUp={() => switchLanguage("en")}
					>
						{translation[language].en}
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default HeaderComponent;
