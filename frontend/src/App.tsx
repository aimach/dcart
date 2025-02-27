// import des bibliothèques
// import des composants
import NavComponent from "./components/common/NavComponent";
// import des services
import { getHomePageMenuList } from "./utils/menu/menuListArrays";
// import des custom hooks
import { useTranslation } from "./utils/hooks/useTranslation";
// import du style
import style from "./App.module.scss";

/**
 * Composant principal de l'application qui affiche la page d'accueil
 * @returns {JSX.Element} - Les éléments de la page d'accueil : titre, description et barre de navigation
 */
function App() {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	return (
		<section className={style.mainPage}>
			<h1>{translation[language].title as string}</h1>
			<div className={style.verticalSeparator} />
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, iure
				amet tempore ut itaque dolor repellendus repellat officiis natus!
				Aliquid ea voluptates suscipit. Odit numquam maxime, blanditiis magnam
				atque sit. Lorem ipsum dolor sit amet consectetur adipisicing elit.
				Animi dolorem laborum ratione adipisci consequuntur sapiente culpa
				reiciendis quis, voluptatum quia, a aperiam velit nam! Dicta saepe
				fugiat ad delectus sunt.
			</p>
			<NavComponent
				type="route"
				navClassName={style.homeMenu}
				list={getHomePageMenuList(translation, language)}
			/>
		</section>
	);
}

export default App;
