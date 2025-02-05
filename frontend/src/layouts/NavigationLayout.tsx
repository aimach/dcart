// import des bibliothèques
import { useState } from "react";
import { Outlet } from "react-router";
// import des composants
import HeaderComponent from "../components/header/Header";
// import du style
import style from "./layout.module.scss";
import AppMenuComponent from "../components/menu/AppMenuComponent";

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
