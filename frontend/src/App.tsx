// import des bibliothèques
import { useContext } from "react";
// import des composants
import NavComponent from "./components/common/NavComponent";
// import du context
import { TranslationContext } from "./context/TranslationContext";
// import des services
import { getHomePageMenuList } from "./utils/menu/menuListArrays";
// import du style
import style from "./App.module.scss";

function App() {
	// récupération des données de traduction
	const { language, translation } = useContext(TranslationContext);

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
