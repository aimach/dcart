// import des bibliothèques
import { useContext } from "react";
// import du context
import { TranslationContext } from "./context/TranslationContext";
// import du style
import style from "./App.module.scss";
import NavComponent from "./components/common/NavComponent";

function App() {
	const { language, translation } = useContext(TranslationContext);

	const menuList = [
		{
			id: "maps",
			title: translation[language].navigation.explore,
			onClickFunction: undefined,
			route: "maps/categories",
		},
		{
			id: "storymaps",
			title: translation[language].navigation.discover,
			onClickFunction: undefined,
			route: "/storymaps",
		},
	];

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
				list={menuList}
			/>
		</section>
	);
}

export default App;
