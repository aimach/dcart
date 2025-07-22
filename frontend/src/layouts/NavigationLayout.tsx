// import des bibliothèques
import { useState } from "react";
import { Outlet } from "react-router";
// import des composants
import HeaderComponent from "../components/header/Header";
import AppMenuComponent from "../components/menu/AppMenuComponent";
// import du style
import style from "./layout.module.scss";

/**
 * Layout de la navigation qui affiche le header ou le composant du menu (pleine page)
 * @returns HeaderComponent | AppMenuComponent
 */
const NavigationLayout = () => {
	// on initie le state pour l'affichage du menu
	const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

	return menuIsOpen ? (
		<AppMenuComponent setMenuIsOpen={setMenuIsOpen} />
	) : (
		<div className={style.layout}>
			<HeaderComponent type={"visitor"} setMenuIsOpen={setMenuIsOpen} />
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default NavigationLayout;
